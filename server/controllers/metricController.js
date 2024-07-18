const {CloudWatchClient, GetMetricStatisticsCommand} = require('@aws-sdk/client-cloudwatch');
// const { ECSClient, DescribeServicesCommand, ListTasksCommand, DescribeTasksCommand } = require("@aws-sdk/client-ecs");

const { ECSClient, ListServicesCommand, DescribeServicesCommand, ListTasksCommand, DescribeTasksCommand} = require('@aws-sdk/client-ecs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/Accounts.db');
const notificationStore = require('../database/notificationStore');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('Fail to connect to Credential database');
    } else {
        console.log('Connected to the database');
    }
});

async function getCloudWatchMetrics(cloudwatchClient, metricName, namespace, dimensions) {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 1 * 24 * 60 * 60 * 1000); //1 days
    const command = new GetMetricStatisticsCommand({
      Namespace: namespace,
      MetricName: metricName,
      Dimensions: dimensions,
      StartTime: startTime,
      EndTime: endTime,
      Period: 60 * 60, // every one hour
      Statistics: ['Average', 'Minimum', 'Maximum', 'Sum']
    });
  
    const response = await cloudwatchClient.send(command);
    const sortedDatapoints = response.Datapoints.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));
    return sortedDatapoints;
}

async function getserviceStatus(ecsClient, clusterName, serviceName) {
    const serviceCommand = new DescribeServicesCommand({
      cluster: clusterName,
      services: [serviceName]
    });
  
    const serviceResponse = await ecsClient.send(serviceCommand);
    const serviceStatus = serviceResponse.services[0]?.status;
    return [serviceStatus];
}

async function getTaskStatus(ecsClient, clusterName, serviceName) {
    const tasksCommand = new ListTasksCommand({
      cluster: clusterName,
      serviceName: serviceName
    });
  
    const tasksResponse = await ecsClient.send(tasksCommand);
    const taskArns = tasksResponse.taskArns;
  
    let taskStatuses = [];
    if (taskArns.length > 0) {
      const describeTasksCommand = new DescribeTasksCommand({
        cluster: clusterName,
        tasks: taskArns
      });
  
      const taskDetails = await ecsClient.send(describeTasksCommand);
      taskStatuses = taskDetails.tasks.map(task =>  ({
        taskArn: task.taskArn,
        lastStatus: task.lastStatus})
      );
    }
    return taskStatuses;
}

async function getTotalTask(ecsClient, clusterName) {
    try {
        // get all services from cluster
        const listServicesCommand = new ListServicesCommand({
            cluster: clusterName
        });

        const listServicesResponse = await ecsClient.send(listServicesCommand);
        const serviceArns = listServicesResponse.serviceArns;

        if (serviceArns.length === 0) {
            return {
                totalTasks: 0,
                runningTasks: 0,
                pendingTasks: 0,
                failedTasks: 0
            };
        }

        // get detail information about each service
        const describeServicesCommand = new DescribeServicesCommand({
            cluster: clusterName,
            services: serviceArns
        });

        const describeServicesResponse = await ecsClient.send(describeServicesCommand);
        const services = describeServicesResponse.services;

        let totalTasks = 0;
        let runningTasks = 0;
        let pendingTasks = 0;
        let stoppedTasks = 0;

        services.forEach(service => {
            const desiredTasks = service.desiredCount;
            const currentRunningTasks = service.runningCount;
            const currentPendingTasks = service.pendingCount;

            // calculate failed tasks 
            const currentFailedTasks = desiredTasks - currentRunningTasks - currentPendingTasks;

            totalTasks += desiredTasks;
            runningTasks += currentRunningTasks;
            pendingTasks += currentPendingTasks;
            stoppedTasks += currentFailedTasks > 0 ? currentFailedTasks : 0;
        });

        return {
            totalTasks,
            runningTasks,
            pendingTasks,
            stoppedTasks
        };
    } catch (error) {
        console.error(`Error retrieving task status for cluster ${clusterName}:`, error);
        throw error;
    }
}

function fillMissingData(dataPoints) {
    const result = [];
    const now = new Date();
    const defaultDataPoint = {
        Average: 0,
        Sum: 0,
        Minimum: 0,
        Maximum: 0,
        Unit: "Percent"
      };
    for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - i);
        const dataPoint = dataPoints.find(dp => {
            const dpTime = new Date(dp.Timestamp);
            return dpTime.getFullYear() === hour.getFullYear() &&
                   dpTime.getMonth() === hour.getMonth() &&
                   dpTime.getDate() === hour.getDate() &&
                   dpTime.getHours() === hour.getHours();
        });
        if (dataPoint) {
            result.push({ ...dataPoint });
        } else {
            result.push({ Timestamp: hour, ...defaultDataPoint });
        }
    }
    return result.reverse(); 
}

//userId, accountName, region, clusterName, metricName , serviceName, completeData
function checkMetricThreshold(user_id, account_name, region, cluster_name, metric_name, service_name = null, completeData) {
    return new Promise((resolve, reject) => {
      const dbPathNotification = path.resolve(__dirname, '../database/Notifications.db');
      const dbNotification = new sqlite3.Database(dbPathNotification, (err) => {
        if (err) {
          console.log('Fail to connect to Notifications database');
          return reject('Fail to connect to Notifications database');
        }
      });
  
      let searchQuery;
      let searchParams;
  
      if (service_name == null) {
        searchQuery = `
          SELECT threshold, operator FROM Notifications 
          WHERE user_id = ? AND account_name = ? AND region = ? AND cluster_name = ? AND metric_name = ?
        `;
        searchParams = [user_id, account_name, region, cluster_name, metric_name];
      } else {
        searchQuery = `
          SELECT threshold, operator FROM Notifications 
          WHERE user_id = ? AND account_name = ? AND region = ? AND cluster_name = ? AND metric_name = ? AND (service_name = ? OR service_name = 'all')
        `;
        searchParams = [user_id, account_name, region, cluster_name, metric_name, service_name];
      }
  
      dbNotification.get(searchQuery, searchParams, (err, row) => {
        if (err) {
          console.error('Error occurred during search notification database in metricController:', err);
          return reject('Error occurred during search notification database');
        }
        if (row) {
          const { threshold, operator } = row;
          // console.log(threshold);
          // console.log(operator);
          // go through completeData
          completeData.forEach(dataPoint => {
            const { Average, Timestamp } = dataPoint;
            // if lastScanDate not null and Timestamp of completeData < lastScanData
            let notify = false;
            switch(operator) {
              case 'greaterThan':
                notify = Average > threshold;
                break;
              case 'greaterThanOrEqual': 
                notify = Average >= threshold;
                break;
              case 'lessThan':
                notify = Average < threshold;
                break;
              case 'lessThanOrEqual':
                notify = Average <= threshold;
                break;
              case 'equal':
                notify = Average == threshold;
                break;
              default:
                break;
            }
            if (notify) {
              notificationStore.notificationData.push({
                timestamp: Timestamp,
                metricName: metric_name,
                value: Average,
                threshold: threshold,
                operator: operator,
                clusterName: cluster_name,
                serviceName: service_name,
                Logs: `${metric_name} value(${Average}) is ${operator} than threshold(${threshold})`
              });
            }
          });
          resolve(); // Resolve the promise after processing the data
        } else {
          resolve(); // Resolve the promise if no row is found
        }
      });
    });
}

async function handleMetricRequest(ws, userId, accountName, region, clusterName, serviceName, metricName) {
    db.all(`SELECT access_key, secret_key FROM Accounts WHERE user_id = ? AND account_name = ?`, [userId, accountName], async(err, rows) => {
        if (err) {
            console.log('Error querying the database:', err.message);
            ws.send(JSON.stringify({ error: 'Error querying the database' }));
            ws.close();
            return;
        }

        if (rows.length === 0) {
            ws.send(JSON.stringify({ error: 'No credentials found for the specified user ID.' }));
            ws.close();
            return;
        }

        const { access_key, secret_key } = rows[0];
        const cloudwatchClient = new CloudWatchClient({
            region: region,
            credentials: {
                accessKeyId: access_key,
                secretAccessKey: secret_key
            }
        });
        const ecsClient = new ECSClient({
            region: region,
            credentials: {
              accessKeyId: access_key,
              secretAccessKey: secret_key
            }
        });

        const dimensionsEcs = [
            { Name: 'ClusterName', Value: clusterName },
            { Name: 'ServiceName', Value: serviceName }
        ];
        const dimensionsContainerInsights = [
            { Name: 'ClusterName', Value: clusterName }
        ];

        const sendData = async () => {
            try {
                let data;
                let completeData
                if (metricName === 'NetworkRxBytes' || metricName === 'NetworkTxBytes') {
                    data = await getCloudWatchMetrics(cloudwatchClient, metricName, 'ECS/ContainerInsights', dimensionsContainerInsights);
                    completeData = fillMissingData(data);
                    await checkMetricThreshold (userId, accountName, region, clusterName, metricName, null, completeData)
                } else if (metricName === 'serviceStatus') {
                    completeData = await getserviceStatus(ecsClient, cluster_name, serviceName);
                } else if (metricName === 'taskStatus') {
                    completeData = await getTaskStatus(ecsClient, cluster_name, serviceName);
                } else if (metricName === 'CPUUtilization' || metricName === 'MemoryUtilization') {
                    data = await getCloudWatchMetrics(cloudwatchClient, metricName, 'AWS/ECS', dimensionsEcs);
                    completeData = fillMissingData(data);
                    await checkMetricThreshold (userId, accountName, region, clusterName, metricName , serviceName, completeData)
                } else if (metricName === 'RunningTaskCount' || metricName === 'PendingTaskCount') {
                    completeData = await getCloudWatchMetrics(cloudwatchClient, metricName , 'ECS/ContainerInsights', dimensionsEcs);
                } else if (metricName === 'totalTasks') {
                    completeData = await getTotalTask(ecsClient, clusterName);
                }else {
                    ws.send(JSON.stringify({ error: 'We don\'t support this metric' }));
                    ws.close();
                    return;
                }
                ws.send(JSON.stringify(completeData));
            } catch (err) {
                ws.send(JSON.stringify({ error: 'Error fetching metric data' }));
                ws.close();
                return;
            }
        };
        sendData();
        const intervalId = setInterval(sendData, 60 * 1000); //update everyone minute

        ws.on('close', () => {
            clearInterval(intervalId);
        });
    })
}

module.exports = {
    handleMetricRequest
};