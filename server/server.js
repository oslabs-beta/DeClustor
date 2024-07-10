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
const notificationController = require('./controllers/notificationController');
const PORT = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, '../client/dist')));

// users authentication
app.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json({ message: 'user created' });
});

app.post('/login', userController.verifyUser, (req, res) => {
  res.status(200).json({ message: 'logged in!' });
});

// saving credentials of aws
app.post('/credentials', credentialsController.saveCredentials, (req, res) => {
  res.status(200).json({ message: 'got your credentials!' });
});

// get all service in users cluster
app.get('/listAllService', listController.Service);

// notification 
app.post('/setNotification', notificationController.setNotification, (req, res) => {
  res.status(200).json({ message: 'save notification settings!' });
});
// app.delete('/removeNotification', notificationController.deleteNotification, (req, res) => {
//   res.status(200).json({ message: 'remove notification settings!' });
// })

wss.on('connection', async (ws, req) => {
  // get metric data controller
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
    // check notification controller
  } else if (req.url.startsWith('/checkNotifications')){
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    
    if (!userId) {
      ws.send(JSON.stringify({ error: 'Missing required parameters' }));
      ws.close();
      return;
    }
    await notificationController.handleNotificationCheck(ws, userId);

  }else {
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
