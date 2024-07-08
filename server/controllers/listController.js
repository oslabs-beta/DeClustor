const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/Credentials.db');
const db = new sqlite3.Database(dbPath);
const { ECSClient, ListServicesCommand, DescribeServicesCommand } = require("@aws-sdk/client-ecs");

const listController = {};

listController.Service = (req, res, next) => {
  const userId = req.query.userId;
  // get access_key, secret_key, region, and clusterName from Credential Database
  db.all(
    `SELECT access_key, secret_key, region, cluster_name FROM Credentials WHERE user_id = ?`,
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
