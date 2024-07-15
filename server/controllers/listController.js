const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/Accounts.db');
const db = new sqlite3.Database(dbPath);
const { OrganizationsClient, ListAccountsCommand } = require('@aws-sdk/client-organizations');
const { ECSClient, ListClustersCommand, ListServicesCommand, DescribeClustersCommand, DescribeServicesCommand } = require("@aws-sdk/client-ecs");

const listController = {};

// list all root accounts in database
listController.Accounts = (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({error: 'missing required parameter: userId'})
  }
  try {
    const searchQuery = `SELECT account_name FROM Accounts WHERE user_id = ?`;
    db.all(searchQuery, [userId], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Error occurred during query the database on listAccount controller' });
      }
      return res.status(200).json(row);
    })
  } catch(err) {
    console.error('Error listing Accounts:', err);
    res.status(500).json({ error: 'Error listing Accounts' }); 
  }
}

listController.SubAccounts = (req, res) => {
  const accountId = req.query.accountId;
  if (!accountId) {
    return res.status(400).json({error: 'missing required parameter: accountId'})
  }
  try {
    const searchQuery = `SELECT access_key, secret_key FROM Accounts WHERE id = ?`;
    db.get(searchQuery, [accountId], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Error occurred during query the database on listSubAccounts controller' });
      }
      const {access_key, secret_key } = row;
      console.log(access_key);
      console.log(secret_key);

      const client = new OrganizationsClient({
        region: 'us-east-1',
        credentials: {
          accessKeyId: access_key,
          secretAccessKey: secret_key,
        }
      });
  
      async function listAllAccounts() {
        let accounts = [];
        let nextToken = null;
        try {
          let command = new ListAccountsCommand({});
          let response = await client.send(command);
          console.log('response', response);
          accounts = accounts.concat(response.Accounts);
          nextToken = response.NextToken;
  
          while (nextToken) {
            command = new ListAccountsCommand({ NextToken: nextToken });
            response = await client.send(command);
            accounts = accounts.concat(response.Accounts);
            nextToken = response.NextToken;
          }
  
          return accounts;
        } catch (error) {
          throw new Error('Error listing accounts function from AWS Organizations');
        }
      }
  
      listAllAccounts()
        .then(accounts => {
          res.status(200).json(accounts);
        })
        .catch(error => {
          console.error('Error listing accounts:', error);
          res.status(500).json({ error: 'Error listing accounts from AWS Organizations' });
        });
    }); 
  } catch(err) {
    console.error('Error listing Accounts:', err);
    res.status(500).json({ error: 'Error listing Accounts' }); 
  }
}

listController.Clusters = (req, res) => {
  const regions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2", "af-south-1", "ap-east-1", 
    "ap-south-1", "ap-south-2", "ap-southeast-1", "ap-southeast-2", "ap-southeast-3", 
    "ap-northeast-1", "ap-northeast-2", "ap-northeast-3", "ca-central-1", "eu-central-1", 
    "eu-west-1", "eu-west-2", "eu-west-3", "eu-south-1", "eu-south-2", "eu-north-1", 
    "me-central-1", "me-south-1", "sa-east-1"
  ];
  const accountName = req.query.account_name;
  if (!accountName) {
    return res.status(400).json({ error: 'missing required parameter: account_name' });
  }
  try {
    const getAccountQuery = `SELECT access_key, secret_key FROM Accounts WHERE account_name = ?`;
    db.get(getAccountQuery, [accountName], async (err, account) => {
      if (err) {
        return res.status(500).json({ error: 'Error occurred during query the database for account' });
      }
      if (!account) {
        return res.status(404).json({ error: 'Account not found', notInDatabase: true });
      }
      const { access_key, secret_key } = account;
      const allClusters = [];
      const promises = regions.map(async (region) => {
        const client = new ECSClient({
          region: region,
          credentials: {
            accessKeyId: access_key,
            secretAccessKey: secret_key,
          }
        });
        try {
          const clusters = await listClustersForRegion(client, region);
          if (clusters.length > 0) {
            allClusters.push({
              region: region,
              clusters: clusters
            });
          }
        } catch (error) {
          console.error(`Error listing clusters for region ${region}:`, error);
        }
      });
      await Promise.all(promises);
      res.status(200).json(allClusters); 
    })
  } catch (err) {
    console.error('Error listing all clusters:', err);
    res.status(500).json({ error: 'Error listing all clusters' });
  }
}

async function listClustersForRegion(client, region) {
  let clusterArns = [];
  let nextToken = null;
  try {
    do {
      const command = new ListClustersCommand({ nextToken });
      const response = await client.send(command);
      clusterArns = clusterArns.concat(response.clusterArns);
      nextToken = response.nextToken;
    } while (nextToken);

    if (clusterArns.length === 0) {
      return [];
    }

    const describeCommand = new DescribeClustersCommand({ clusters: clusterArns });
    const describeResponse = await client.send(describeCommand);
    return describeResponse.clusters;
  } catch (error) {
    console.error(`Error listing clusters in region ${region}:`, error);
    throw new Error(`Error listing clusters in region ${region} from AWS ECS`);
  }
}

listController.Services = (req, res) => {
  const userId = req.query.userId;
  // get access_key, secret_key, region, and clusterName from Credential Database
  db.all(
    `SELECT access_key, secret_key, region, cluster_name FROM Accounts WHERE user_id = ?`,
    [userId],
    async (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Error occurred during query the database' });
      } else {
        if (rows.length === 0) {
          return res.status(404).json({
            error:
              'No credentials found for the use, configure Credentials first',
          });
        }
        const { access_key, secret_key, region, cluster_name } = rows[0];

        // use SDK to get list of services in that user’s cluster
        const client = new ECSClient({
          region: region,
          credentials: {
            accessKeyId: access_key,
            secretAccessKey: secret_key,
          },
        });

        try {
          // get list of serviceArns for cluster
          const command = new ListServicesCommand({ cluster: cluster_name });
          const listServiceData = await client.send(command);
          if (listServiceData.serviceArns.length === 0) {
            return res
              .status(404)
              .json({ error: 'No services found in the specific cluster' });
          }
          // get the name of services by serviceArns
          const describeServicesCommand = new DescribeServicesCommand({
            cluster: cluster_name,
            services: listServiceData.serviceArns,
          });
          const describeServiceData = await client.send(
            describeServicesCommand
          );
          res.json(
            describeServiceData.services.map((service) => service.serviceName)
          );
        } catch (err) {
          console.error('Error listing services:', err);
          res.status(500).json({ error: 'Error listing services' });
        }
      }
    }
  );
};

module.exports = listController;
