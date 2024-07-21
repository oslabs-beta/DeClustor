// Import necessary modules and set up the database and email transporter
const path = require('path');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const userdbPath = path.resolve(__dirname, '../database/Users.db');
const userdb = new sqlite3.Database(userdbPath);
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Configure email transporter using environment variables for Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Define userController object to export
const userController = {};

// Create a new user in the database and send a verification email
userController.createUser = (req, res, next) => {
  const { firstname, lastname, username, password, email } = req.body;
  const verificationCode = crypto.randomBytes(3).toString('hex');

  if (!username || !password) {
    return res.status(400).send('Username or password is required');
  }

  // Check if username already exists in the database
  userdb.get(
    'SELECT user_name FROM Users WHERE user_name = ?',
    [username],
    (err, row) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (row) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Insert new user into the database
      userdb.run(
        'INSERT INTO Users (first_name, last_name, user_name, password, email, verification_code, verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [firstname, lastname, username, password, email, verificationCode],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error here' });
          }
      
          userdb.get(
            'SELECT id FROM Users WHERE user_name = ?',
            [username],
            (err, row) => {
              if (err) {
                return res.status(500).json({ message: 'Internal server error' });
              }

              if (row) {
                console.log(row.id);
                res.locals.userId = row.id;
                const mailOptions = {
                  from: 'diweizhi@gmail.com',
                  to: email,
                  subject: 'Email Verification',
                  text: `Your verification code is: ${verificationCode}`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    res.status(500).json({ error: error.message });
                  } else {
                    console.log('Email sent: ' + info.response);
                    next();
                  }
                });
              }
            }
          );
        }
      );
    }
  );
};

// Verify user login credentials
userController.verifyUser = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  userdb.get(
    'SELECT * FROM Users WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      console.log(row);
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!row) {
        return res
          .status(400)
          .json({ message: 'Incorrect username or password' });
      }
      res.locals.userId = row.id;
      next();
    }
  );
};

// Verify the user's email via a provided verification code
userController.verifyEmail = (req, res) => {
  const { email, code } = req.body;

  userdb.get(
    'SELECT * FROM Users WHERE email = ? AND verification_code = ?',
    [email, code],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(400).json({ error: 'Invalid verification code' });
      } else {
        userdb.run(
          'UPDATE Users SET verified = 1 WHERE email = ?',
          [email],
          (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(200).json({ message: 'Email verified successfully' });
            }
          }
        );
      }
    }
  );
};

// Allow a user to request a password reset and send them a reset link
userController.requestPasswordReset = (req, res) => {
  const { email } = req.body;
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

  userdb.run(
    'UPDATE Users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
    [resetToken, resetTokenExpiry, email],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(400).json({ error: 'Email not found' });
      } else {
        // Send reset password email
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
        const mailOptions = {
          from: 'diweizhi@gmail.com',
          to: email,
          subject: 'Password Reset',
          text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(500).json({ error: error.message });
          } else {
            res.status(200).json({ message: 'Password reset link sent to your email' });
          }
        });
      }
    }
  );
};

// Reset the user's password using a token received in their email
userController.resetPassword = (req, res) => {
  const { email, token, newPassword } = req.query;

  userdb.get(
    'SELECT * FROM Users WHERE email = ? AND reset_token = ? AND reset_token_expiry > ?',
    [email, token, Date.now()],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(400).json({ error: 'Invalid or expired reset token' });
      } else {
        userdb.run(
          'UPDATE Users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE email = ?',
          [newPassword, email],
          (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(200).json({ message: 'Password reset successfully' });
            }
          }
        );
      }
    }
  );
};

// Handle user login with Google OAuth
userController.googleLogin = (accessToken, refreshToken, profile, done) => {
  const firstname = profile.given_name;
  const lastname = profile.lastname;
  const googleId = profile.id;
  const username = profile.emails[0].value;
  userdb.get(
    'SELECT * FROM Users WHERE user_name = ?',
    [username],
    (err, row) => {
      if (err) {
        return done(err);
      } else if (row) {
        return done(null, row);
      } else {
        userdb.run(
          'INSERT INTO Users (first_name, last_name, user_name, password, email, verification_code, verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [firstname, lastname, username, googleId],

          function (err) {
            if (err) {
              return done(err);
            } else {
              const newUser = {
                id: this.lastID,
                first_name: firstname,
                last_name: lastname,
                user_name: username,
                password: googleId,
              };
              return done(null, newUser);
            }
          }
        );
      }
    }
  );
};

module.exports = userController;
