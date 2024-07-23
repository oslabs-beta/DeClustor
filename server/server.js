// Load required modules
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const app = express();

// Controllers for handling business logic
const userController = require('./controllers/userController');
const metricController = require('./controllers/metricController');
const credentialsController = require('./controllers/credentialsController');
const notificationController = require('./controllers/notificationController');

// Router for handling listing operations
const listRouter = require('./router/listRouter');
const PORT = 3000;

// CORS settings to allow interactions between different ports during development
const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const crypto = require('crypto');

// Generating a random secret for session handling
const secret = crypto.randomBytes(16).toString('hex');

//list Router: including list all accounts, subaccounts, region, cluster, service
app.use('/list', listRouter);

//Setup session management for the application
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

// Setting up the SQLite database for user management
const sqlite3 = require('sqlite3');
const userdbPath = path.resolve(__dirname, './database/Users.db');
const userdb = new sqlite3.Database(userdbPath);

// Configure Google OAuth strategy
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
            return done(null, row);
          } else {
            const insert =
              'INSERT INTO Users (google_id, user_name, email) VALUES (?, ?, ?)';
            userdb.run(
              insert,
              [profile.id, profile.displayName, profile.emails[0].value],
              function (err) {
                if (err) {
                  return done(err);
                }
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

// Serializes the user ID to manage session authentication
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializes the user from the session using the user ID
passport.deserializeUser((id, done) => {
  userdb.get('SELECT * FROM Users WHERE id = ?', [id], function (err, row) {
    if (err) {
      return done(err);
    }
    done(null, row);
  });
});

// Authentication routes for Google OAuth
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Redirect new users to credentials page, existing users to dashboard
    if (req.user.isNewUser) {
      res.redirect('http://localhost:8080/credentials');
    } else {
      res.redirect('http://localhost:8080/dashboard');
    }
  }
);

// Configure GitHub OAuth strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
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
            return done(null, row);
          } else {
            const insert =
              'INSERT INTO Users (google_id, user_name, email) VALUES (?, ?, ?)';
            userdb.run(
              insert,
              [profile.id, profile.username, profile.emails[0].value],
              function (err) {
                console.log(err);
                if (err) {
                  return done(err);
                }
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

// Authentication routes for GitHub OAuth
app.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Redirect new users to credentials page, existing users to dashboard
    if (req.user.isNewUser) {
      res.redirect('http://localhost:8080/credentials');
    } else {
      res.redirect('http://localhost:8080/dashboard');
    }
  }
);

// Failure route for login
app.get('/login', (req, res) => {
  res.send('Login Failed');
});

// Current user info endpoint, checks if user is authenticated
app.get('/api/current_user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// User-related routes
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
app.post('/verify-email', userController.verifyEmail);
app.post('/request-password-reset', userController.requestPasswordReset);
app.post('/reset-password', userController.resetPassword);

// Credentials handling
app.post('/credentials', credentialsController.saveCredentials, (req, res) => {
  res.status(200).json({ message: 'got your credentials!' });
});

// Notification settings
app.post(
  '/setNotification',
  notificationController.setNotification,
  (req, res) => {
    res.status(200).json({ message: 'save notification settings!' });
  }
);

// WebSocket connections for metric and notification data
wss.on('connection', async (ws, req) => {
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

// Default 404 route
app.use((req, res) => res.sendStatus(404));
// Global error handling middleware
app.use((err, req, res) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Export server and app for testing or further integration
module.exports = {server, app};