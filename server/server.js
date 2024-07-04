const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();

const userController = require('./controllers/userController');

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json({ message: 'user created' });
});

app.post('/login', userController.verifyUser, (req, res) => {
  res.status(200).json({ message: 'logged in!' });
});

app.get('/getCpu', (req, res) => {});
app.get('/getMemory', (req, res) => {});
app.get('/getNetworkRxBytes', (req, res) => {});
app.get('/getNetworkTxBytes', (req, res) => {});
app.get('/getServerStatus', (req, res) => {});
app.get('/getTaskStatus', (req, res) => {});

app.use((req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  console.log(err);
  return res.status(errorObj.status).json(errorObj.message);
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
