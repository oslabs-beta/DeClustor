const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// const {OAuth2Client } = require('google-auth-library');

const app = express();
const userController = require('./controllers/userController');
const listController = require('./controllers/listController');
const metricController = require('./controllers/metricController');
const credentialsController = require('./controllers/credentialsController');
const notificationController = require('./controllers/notificationController');

const { access } = require('fs');

const PORT = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Replace with your Google client ID and secret

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/google/callback',
    },
    userController.googleLogin
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../client/dist')));

app.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json({ message: 'user created' });
});

// app.post('/login', userController.verifyUser, (req, res) => {
//   res.status(200).json({ message: 'logged in!' });
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

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/protected',
  })
);

app.get('/auth/failure', (req, res) => {
  res.send('something went wrong');
});

app.get('/protected', isLoggedIn, (req, res) => {
  res.send('Hello');
});

// app.get('/profile', (req, res) => {
//   if (!req.user) {
//     res.redirect('/');
//   } else {
//     res.send(`Hello ${req.user.displayName}`);
//   }
// });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// app.post('/', async (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//   res.header('Referrer-Policy', 'no-referrer-when-downgrade');
//   const redirectUrl = 'http://127.0.0.1:3000/oauth';

//   const OAuth2Client = new OAuth2Client(
//     GOOGLE_CLIENT_ID,
//     GOOGLE_CLIENT_SECRET,
//     redirectUrl
//   );

//   const authorizeUrl = OAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
//     prompt: 'consent',
//   });

//   res.json({ url: authorizeUrl });
// });

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
