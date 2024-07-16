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

const app = express();
const userController = require('./controllers/userController');
const listController = require('./controllers/listController');
const metricController = require('./controllers/metricController');
const credentialsController = require('./controllers/credentialsController');
const notificationController = require('./controllers/notificationController');

const listRouter = require('./router/listRouter');
//list Router: including list all accounts, subaccounts, region, cluster, service
app.use('/list', listRouter);

const { access } = require('fs');
const PORT = 3000;
const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const crypto = require('crypto');
const secret = crypto.randomBytes(16).toString('hex');

//test passport.use:
const session = require('express-session');

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const sqlite3 = require('sqlite3').verbose();

const userdbPath = path.resolve(__dirname, './database/Users.db');
const userdb = new sqlite3.Database(userdbPath);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      userdb.get(
        'SELECT * FROM Users WHERE google_id = ?',
        [profile.id],
        function (err, row) {
          if (err) {
            return done(err);
          }
          if (row) {
            console.log('already exist in Users');
            return done(null, row);
          } else {
            const insert =
              'INSERT INTO Users (google_id, user_name) VALUES (?, ?)';
            userdb.run(
              insert,
              [profile.id, profile.displayName],
              function (err) {
                if (err) {
                  return done(err);
                }
                console.log('insert into User database');
                console.log('this.lastId', this.lastID);
                return done(null, {
                  google_id: profile.id,
                  user_name: profile.displayName,
                  id: this.lastID,
                  isNewUser: true,
                });
              }
            );
          }
        }
      );
    }
  )
);
passport.serializeUser((user, done) => {
  console.log('user.id', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userdb.get(
    'SELECT * FROM Users WHERE id = ?',
    [id],
    function (err, row) {
      if (err) {
        return done(err);
      }
      done(null, row);
    }
  );
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    if (req.user.isNewUser) {
      res.redirect('http://localhost:8080/credentials');
    } else {
      res.redirect('http://localhost:8080/dashboard');
    }
  }
);

app.get('/login', (req, res) => {
  res.send('Login Failed');
});

app.get('/api/current_user', (req, res) => {
  if (req.isAuthenticated()) {
    console.log('req.user', req.user);
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

app.use(express.static(path.join(__dirname, '../client/dist')));
app.post('/signup', userController.createUser, (req, res) => {
  const userId = res.locals.userId;
  res.status(200).json({ userId: userId, message: 'user created' });
});

app.post('/login', userController.verifyUser, (req, res) => {
  const userId = res.locals.userId;
  const username = req.body.username;
  const serviceName = 'service1'; // default name
  res
    .status(200)
    .json({ userId, username, serviceName, message: 'logged in!' });
});

// RETURN Accounts_id   (change later)
app.post('/credentials', credentialsController.saveCredentials, (req, res) => {
  res.status(200).json({ message: 'got your credentials!' });
});

// notification
app.post(
  '/setNotification',
  notificationController.setNotification,
  (req, res) => {
    res.status(200).json({ message: 'save notification settings!' });
  }
);

wss.on('connection', async (ws, req) => {
  // get metric data controller
  if (req.url.startsWith('/getMetricData')) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    const accountName = urlParams.get('accountName');
    const region = urlParams.get('region');
    const clusterName = urlParams.get('clusterName');
    const serviceName = urlParams.get('serviceName');
    const metricName = urlParams.get('metricName');
    if (!userId || !metricName || !accountName || !clusterName || !region) {
      ws.send(JSON.stringify({ error: 'Missing required parameters' }));
      ws.close();
      return;
    }
    await metricController.handleMetricRequest(
      ws,
      userId,
      accountName,
      region,
      clusterName,
      serviceName,
      metricName
    );
    // check notification controller
  } else if (req.url.startsWith('/checkNotifications')) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const userId = urlParams.get('userId');
    if (!userId) {
      ws.send(JSON.stringify({ error: 'Missing required parameters' }));
      ws.close();
      return;
    }
    await notificationController.handleNotificationCheck(ws, userId);
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
