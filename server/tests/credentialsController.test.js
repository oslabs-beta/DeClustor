const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const credentialsController = require('../controllers/credentialsController');

jest.mock('sqlite3', () => {
    const mockDbQuery = jest.fn((sql, params, callback) => {
        if (sql.includes('SELECT access_key, account_name FROM Accounts WHERE access_key = ? OR (user_id = ? AND account_name = ?)')) {
            if (params[0] === 'existingAccessKey') {
                callback(null, { access_key: 'existingAccessKey', account_name: 'otherAccountName' });
            } else if (params[2] === 'existingAccountName') {
                callback(null, { access_key: 'otherAccessKey', account_name: 'existingAccountName' });
            } else {
                callback(null, null);
            }
        } else {
            callback(null, []);
        }
    });

    const mockDbRun = jest.fn((sql, params, callback) => {
        callback(null);
    });

    return {
        Database: jest.fn(() => ({
            get: mockDbQuery,
            run: mockDbRun
        }))
    };
});

const app = express();
app.use(bodyParser.json());

app.post('/credentials', credentialsController.saveCredentials, (req, res) => {
    res.status(200).send('Credentials saved');
});

describe('credentialsController tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/credentials')
            .send({ userId: 'testUser', accessKey: 'testAccessKey', accountType: 'root' });

        expect(response.status).toBe(400);
        expect(response.text).toBe('missing information');
    });

    test('should return 400 if accessKey already exists', async () => {
        const response = await request(app)
            .post('/credentials')
            .send({ userId: 'testUser', accessKey: 'existingAccessKey', secretKey: 'testSecretKey', accountName: 'newAccountName', accountType: 'root' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('AccessKey already exists');
        expect(response.body.alreadyExist).toBe(true);
    });

    test('should return 400 if accountName already exists for the user', async () => {
        const response = await request(app)
            .post('/credentials')
            .send({ userId: 'testUser', accessKey: 'newAccessKey', secretKey: 'testSecretKey', accountName: 'existingAccountName', accountType: 'root' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Account name already exists for this user');
        expect(response.body.alreadyExist).toBe(true);
    });

    test('should save credentials if all fields are valid', async () => {
        const response = await request(app)
            .post('/credentials')
            .send({ userId: 'testUser', accessKey: 'newAccessKey', secretKey: 'newSecretKey', accountName: 'newAccountName', accountType: 'root' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Credentials saved');
    });
});
