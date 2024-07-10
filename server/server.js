const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocket = require('ws');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const cors = require('cors');
// const session = require('express-session');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// const { OAuth2Client } = require('google-auth-library');

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    userController.googleLogin
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(
  cookieSession({
    name: 'session',
    keys: ['lama'],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../client/dist')));

// users authentication
app.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json({ message: 'user created' });
});

app.post('/login', userController.verifyUser, (req, res) => {
  const userId = res.locals.userId;
  const username = req.body.username;
  const serviceName = 'service1'; // default name
  res
    .status(200)
    .json({ userId, username, serviceName, message: 'logged in!' });
});

// saving credentials of aws
app.post('/credentials', credentialsController.saveCredentials, (req, res) => {
  res.status(200).json({ message: 'got your credentials!' });
});

// get all service in users cluster
app.get('/listAllService', listController.Service);

// notification
app.post(
  '/setNotification',
  notificationController.setNotification,
  (req, res) => {
    res.status(200).json({ message: 'save notification settings!' });
  }
);

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

// function isLoggedIn(req, res, next) {
//   req.user ? next() : res.sendStatus(401);
// }

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'success',
      user: req.user,
      cookies: req.cookies,
    });
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:3000/');
});

app.get('/login/falied', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  });
});

app.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/protected',
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/falied',
    successRedirect: 'http://localhost:8080/dashboard',
  })
);

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
