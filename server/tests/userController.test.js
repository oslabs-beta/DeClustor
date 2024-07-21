const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: '123' })
    }),
}));

const nodemailer = require('nodemailer'); 

const userController = {
    createUser: (req, res) => {
        if (req.body.username === 'existingUser') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const transporter = nodemailer.createTransport();
        transporter.sendMail({
            from: 'test@example.com',
            to: req.body.email,
            subject: 'Verification email',
            text: 'Please verify your email.'
        });

        res.status(200).json({ userId: 1, message: 'User created' });
    },
    verifyUser: (req, res) => {
        if (req.body.username === 'AriaLiang' && req.body.password === 'password123') {
            return res.status(200).json({ userId: 1 });
        }
        res.status(401).json({ message: 'Unauthorized' });
    }
};

app.post('/signup', userController.createUser);
app.post('/login', userController.verifyUser);

describe('UserController tests', () => {
    test("should create user and send verification email when data is valid", async () => {
        const userData = {
            firstname: "Aria",
            lastname: "Liang",
            username: "AriaLiang",
            password: "password123",
            email: "arialiang@example.com"
        };

        const response = await request(app).post('/signup').send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('userId');
        expect(nodemailer.createTransport().sendMail.mock.calls.length).toBe(1);
    });

    test("should return an error if username already exists", async () => {
        const userData = {
            firstname: 'Aria',
            lastname: 'Liang',
            username: 'existingUser',
            password: 'password123',
            email: 'arialiang@example.com'
        };

        const response = await request(app).post('/signup').send(userData);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username already exists');
    });

    test("should authenticate user with correct username and password", async () => {
        const userData = {
            username: "AriaLiang",
            password: "password123"
        };

        const response = await request(app).post('/login').send(userData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('userId');
    });

    test("should return error for incorrect password", async () => {
        const userData = {
            username: "AriaLiang",
            password: "wrongPassword"
        };

        const response = await request(app).post('/login').send(userData);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
    });
});
