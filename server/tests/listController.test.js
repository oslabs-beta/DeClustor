const request = require('supertest');
const express = require('express');
const listController = require('../controllers/listController');

jest.mock('sqlite3', () => {
    const mockDbQuery = jest.fn((sql, params, callback) => {
        if (sql.includes('Accounts WHERE user_id = ? AND account_type = "root"')) {
            callback(null, [{ account_name: 'rootAccount' }]);
        } else if (sql.includes('Accounts WHERE user_id = ? AND account_type = "subaccount"')) {
            callback(null, [{ account_name: 'subAccount' }]);
        } else if (sql.includes('Accounts WHERE account_name = ? AND user_id = ?')) {
            callback(null, { access_key: 'testAccessKey', secret_key: 'testSecretKey' });
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

const mockSend = jest.fn();
jest.mock('@aws-sdk/client-organizations', () => {
    const actualModule = jest.requireActual('@aws-sdk/client-organizations');
    return {
        ...actualModule,
        OrganizationsClient: jest.fn(() => ({
            send: mockSend
        })),
    };
});

jest.mock('@aws-sdk/client-ecs', () => {
    const actualModule = jest.requireActual('@aws-sdk/client-ecs');
    return {
        ...actualModule,
        ECSClient: jest.fn(() => ({
            send: jest.fn((command) => {
                if (command.constructor.name === 'ListClustersCommand') {
                    return Promise.resolve({
                        clusterArns: ['clusterArn']
                    });      
                } else if (command.constructor.name === 'DescribeClustersCommand') {
                    return Promise.resolve({
                        clusters: [{ clusterName: 'testCluster' }]
                    });
                } else if (command.constructor.name === 'ListServicesCommand') {
                    return Promise.resolve({
                        serviceArns: ['serviceArn']
                    });
                } else if (command.constructor.name === 'DescribeServicesCommand') {
                    return Promise.resolve({
                        services: [{ serviceName: 'testService' }]
                    });
                }
            })
        })),
    };
});

const app = express();
app.use(express.json());
app.use('/list', require('../router/listRouter'));

describe('listController tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSend.mockImplementation((command) => {
            if (command.constructor.name === 'ListAccountsCommand') {
                return Promise.resolve({
                    Accounts: [{ Id: '1', Name: 'TestAccount' }, { Id: '2', Name: 'TestAccount2' }],
                    NextToken: null
                });
            }
        });
    });

    test('should list all root and sub accounts', async () => {
        const response = await request(app).get('/list/AllAccounts?userId=testUser');
        expect(response.status).toBe(200);
        expect(response.body.root).toEqual([{ account_name: 'rootAccount' }]);
        expect(response.body.subaccount).toEqual([{ account_name: 'subAccount' }]);
    });

    test('should list all sub accounts from AWS', async () => {
        const response = await request(app).get('/list/AllSubAccounts?userId=testUser&accountName=testAccount');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { Id: '1', Name: 'TestAccount' },
            { Id: '2', Name: 'TestAccount2' }
        ]);
    });

    test('should list all clusters in all regions', async () => {
        const response = await request(app).get('/list/AllClusters?userId=1&accountName=testAccount');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { region: 'us-east-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'us-east-2', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'us-west-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'us-west-2', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'af-south-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-east-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-south-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-south-2', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-southeast-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-southeast-2', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-southeast-3', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-northeast-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-northeast-2', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ap-northeast-3', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'ca-central-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'eu-central-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'eu-west-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'eu-west-2', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'eu-west-3', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'eu-south-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'eu-south-2', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'eu-north-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'me-central-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'me-south-1', clusters: [{ clusterName: 'testCluster' }] },
            { region: 'sa-east-1', clusters: [{ clusterName: 'testCluster' }] }
        ]);
    });

    test('should list all services in a cluster', async () => {
        const response = await request(app).get('/list/AllServices?userId=1&accountName=testAccount&clusterName=testCluster&region=us-east-1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(['testService']);
    });
});
