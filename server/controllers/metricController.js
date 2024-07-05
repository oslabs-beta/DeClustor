const {CloudWatchClient, GetMetricStatisticsCommand} = require('@aws-sdk/client-cloudwatch');
const { ECSClient, DescribeServicesCommand, ListTasksCommand, DescribeTasksCommand } = require("@aws-sdk/client-ecs");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/Credentials.db', (err) => {
    if (err) {
        console.log('Fail to connect to Credential database');
    } else {
        console.log('Connected to the database');
    }
});

async function getCloudWatchMetrics(cloudwatchClient, metricName, namespace, dimensions) {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 3 * 24 * 60 * 60 * 1000); //3 days
  
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
    const tasksCommand = new ListTasksCommand({
        cluster: clusterName
    });

    const taskResponse = await ecsClient.send(tasksCommand);
    const taskArns = taskResponse.taskArns;

    const describeTasksCommand = new DescribeTasksCommand({
        cluster: clusterName,
        tasks: taskArns
    });

    const taskDetails = await ecsClient.send(describeTasksCommand);
    const tasks = taskDetails.tasks;
    const totalTasks = tasks.length;
    const runningTasks = tasks.filter(task => task.lastStatus === 'RUNNING').length;
    const pendingTasks = tasks.filter(task => task.lastStatus === 'PENDING').length;
    const stoppedTasks = tasks.filter(task => task.lastStatus === 'STOPPED').length;

    return {
        totalTasks,
        runningTasks,
        pendingTasks,
        stoppedTasks
    };
}

async function handleMetricRequest(ws, userId, serviceName, metricName) {
    db.all(`SELECT access_key, secret_key, region, cluster_name FROM Credentials WHERE user_id = ?`, [userId], async(err, rows) => {
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

        const { access_key, secret_key, region, cluster_name } = rows[0];
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
            { Name: 'ClusterName', Value: cluster_name },
            { Name: 'ServiceName', Value: serviceName }
        ];
        const dimensionsContainerInsights = [
            { Name: 'ClusterName', Value: cluster_name }
        ];

        const sendData = async () => {
            try {
                let data;
                if (metricName === 'NetworkRxBytes' || metricName === 'NetworkTxBytes') {
                    data = await getCloudWatchMetrics(cloudwatchClient, metricName, 'ECS/ContainerInsights', dimensionsContainerInsights);
                } else if (metricName === 'serviceStatus') {
                    data = await getserviceStatus(ecsClient, cluster_name, serviceName);
                } else if (metricName === 'taskStatus') {
                    data = await getTaskStatus(ecsClient, cluster_name, serviceName);
                } else if (metricName === 'CPUUtilization' || metricName === 'MemoryUtilization') {
                    data = await getCloudWatchMetrics(cloudwatchClient, metricName, 'AWS/ECS', dimensionsEcs);
                } else if (metricName === 'RunningTaskCount' || metricName === 'PendingTaskCount') {
                    data = await getCloudWatchMetrics(cloudwatchClient, metricName , 'ECS/ContainerInsights', dimensionsEcs);
                } else if (metricName === 'totalTasks') {
                    data = await getTotalTask(ecsClient, cluster_name);
                }else {
                    ws.send(JSON.stringify({ error: 'We don\'t support this metric' }));
                    ws.close();
                    return;
                }
                ws.send(JSON.stringify(data));
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