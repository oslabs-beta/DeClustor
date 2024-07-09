const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const app = express();
const userController = require('./controllers/userController');
const listController = require('./controllers/listController');
const metricController = require('./controllers/metricController');
const credentialsController = require('./controllers/credentialsController');
const PORT = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/signup', userController.createUser, (req, res) => {
  const { userId } = res.locals; 
  res.status(200).json({ message: 'User created', userId });
});

// app.post('/login', userController.verifyUser, (req, res) => {
//   res.status(200).json(req.user);
// });

app.post('/login', userController.verifyUser, (req, res) => {
  const userId = res.locals.userId;
  const username = req.body.username;
  const serviceName = "service1"; // default name
  res.status(200).json({ userId, username, serviceName, message: 'logged in!' });
});

app.post('/credentials', credentialsController.saveCredentials, (req, res) => {
  res.status(200).json({ message: 'got your credentials!' });
});

app.get('/listAllService', listController.Service);

wss.on('connection', async (ws, req) => {
  if (req.url.startsWith('/getMetricData')) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    const serviceName = urlParams.get('serviceName');
    const metricName = urlParams.get('metricName');

    if (!userId || !metricName) {
      ws.send(JSON.stringify({ error: 'Missing required parameters' }));
      ws.close();
      return;
    }
    await metricController.handleMetricRequest(
      ws,
      userId,
      serviceName,
      metricName
    );
  } else {
    ws.close();
  }
});

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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
