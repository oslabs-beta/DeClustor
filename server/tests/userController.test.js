const request = require('supertest');
const { app } = require('../server');
const sqlite3 = require('sqlite3');
const mockDb = new sqlite3.Database(':memory:');
const nodemailerMock = require('nodemailer-mock');

jest.mock('sqlite3', () => {
    return {
        Database: jest.fn(()=> mockDb)
    };
});

jest.mock('nodemailer', () => nodemailerMock);

describe('UserController - createUser', () => {
    function runSql(db, sql, params = []) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    beforeEach(async() => {
        // delete Users database and recreate a new one
        try {
            await runSql(mockDb, "DROP TABLE IF EXISTS Users");
            const createQuery = `
              CREATE TABLE Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                google_id TEXT,
                first_name TEXT,
                last_name TEXT,
                user_name TEXT,
                password TEXT,
                email TEXT NOT NULL UNIQUE,
                verification_code TEXT,
                verified INTEGER DEFAULT 0,
                reset_token TEXT,
                reset_token_expiry INTEGER
            `;
            await runSql(mockDb, createQuery);
        } catch(err) {
            console.log('Failed to prepare database', err);
        }

        // reset nodemailer 
        nodemailerMock.mock.reset();
    });

    test("should create user and send verification email when data is valid", async() => {
        const userData = {
            google_id: '123',
            first_name: 'Aria',
            last_name: 'Liang',
            user_name: 'AriaLiang',
            password: 'password123',
            email: 'arialiang@example.com'
        }

        const response = await request(app).
    });

    test("should return an error if username already exists", async() => {

    });
})

describe('UserController - verifyUser', async() => {
    test("should authenticate user with corrent username and password", async() => {

    });

    test("should return error for incorrect credentials", async() => {

    });
})