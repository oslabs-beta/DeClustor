const WebSocket = require('ws');
const { handleMetricRequest } = require('../controllers/metricController');

// Mock CloudWatchClient and ECSClient
jest.mock('@aws-sdk/client-cloudwatch', () => {
    return {
        CloudWatchClient: jest.fn(() => ({
            send: jest.fn(() => Promise.resolve({
                Datapoints: [
                    { Timestamp: new Date(), Average: 50, Minimum: 40, Maximum: 60, Sum: 150 }
                ]
            }))
        })),
        GetMetricStatisticsCommand: jest.fn()
    };
});

jest.mock('@aws-sdk/client-ecs', () => {
    return {
        ECSClient: jest.fn(() => ({
            send: jest.fn((command) => {
                if (command.constructor.name === 'DescribeServicesCommand') {
                    return Promise.resolve({ services: [{ status: 'ACTIVE' }] });
                } else if (command.constructor.name === 'ListTasksCommand') {
                    return Promise.resolve({ taskArns: ['task1', 'task2'] });
                } else if (command.constructor.name === 'DescribeTasksCommand') {
                    return Promise.resolve({
                        tasks: [
                            { taskArn: 'task1', lastStatus: 'RUNNING' },
                            { taskArn: 'task2', lastStatus: 'PENDING' }
                        ]
                    });
                } else if (command.constructor.name === 'ListServicesCommand') {
                    return Promise.resolve({ serviceArns: ['service1'] });
                }
            })
        })),
        DescribeServicesCommand: jest.fn(),
        ListTasksCommand: jest.fn(),
        DescribeTasksCommand: jest.fn(),
        ListServicesCommand: jest.fn()
    };
});

jest.mock('sqlite3', () => {
    const mockDbQuery = jest.fn((sql, params, callback) => {
        if (sql.includes('SELECT access_key, secret_key FROM Accounts')) {
            callback(null, [{ access_key: 'testAccessKey', secret_key: 'testSecretKey' }]);
        } else {
            callback(null, []);
        }
    });

    return {
        Database: jest.fn(() => ({
            all: mockDbQuery,
            get: mockDbQuery
        }))
    };
});
jest.mock('../controllers/redisClient', () => ({
    set: jest.fn().mockResolvedValue('OK')
}));

describe('WebSocket metricController tests', () => {
    let server;
    let wss;

    beforeAll(done => {
        server = require('http').createServer();
        wss = new WebSocket.Server({ server });

        wss.on('connection', (ws, req) => {
            if (req.url.startsWith('/getMetricData')) {
                const urlParams = new URLSearchParams(req.url.split('?')[1]);
                const userId = urlParams.get('userId');
                const accountName = urlParams.get('accountName');
                const region = urlParams.get('region');
                const clusterName = urlParams.get('clusterName');
                const serviceName = urlParams.get('serviceName');
                const metricName = urlParams.get('metricName');
                handleMetricRequest(ws, userId, accountName, region, clusterName, serviceName, metricName);
            } else {
                ws.close();
            }
        });

        server.listen(3001, done);
    });

    afterAll(done => {
        wss.close(() => {
            server.close(done);
        });
    });

    test('WebSocket should handle valid metric data requests', done => {
        const ws = new WebSocket('ws://localhost:3001/getMetricData?userId=test&accountName=test&region=test&clusterName=test&serviceName=test&metricName=CPUUtilization');

        ws.on('open', () => {
            ws.send(JSON.stringify({ action: 'getMetricData' }));
        });

        ws.on('message', message => {
            const data = JSON.parse(message);
            expect(data).toEqual(expect.any(Array));
            expect(data[0]).toHaveProperty('Timestamp');
            expect(data[0]).toHaveProperty('Average');
            ws.close();
            done();
        });

        ws.on('error', err => {
            done(err);
        });
    }, 20000);  
});
