const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const userdbPath = path.resolve(__dirname, '../database/Users1.db');
const userdb = new sqlite3.Database(userdbPath);

const userController = {};

userController.createUser = (req, res, next) => {
  const { firstname, lastname, username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username or password is required');
  }

  userdb.get(
    'SELECT user_name FROM Users1 WHERE user_name = ?',
    [username],
    (err, row) => {
      if (err) {
        // userdb.close();
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (row) {
        // userdb.close();
        return res.status(400).json({ message: 'Username already exists' });
      }

      userdb.run(
        'INSERT INTO Users1 (first_name, last_name, user_name, password) VALUES (?, ?, ?, ?)',
        [firstname, lastname, username, password],
        (err) => {
          // userdb.close();
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ message: 'Internal server error here' });
          }
          res.locals.userId = this.lastID;
          // console.log(res.locals.userId);
          userdb.get(
            'SELECT id FROM Users1 WHERE user_name = ?',
            [username],
            (err, row) => {
              if (err) {
                // userdb.close();
                return res
                  .status(500)
                  .json({ message: 'Internal server error' });
              }

              if (row) {
                console.log(row.id);
                res.locals.userId = row.id;
              }
            }
          );

          next();
        }
      );
    }
  );
};

userController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;

  userdb.get(
    'SELECT * FROM Users1 WHERE user_name = ? AND password = ?',
    [username, password],
    (err, row) => {
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

userController.googleLogin = (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  const firstname = profile.given_name;
  const lastname = profile.lastname;
  const googleId = profile.id;
  const username = profile.emails[0].value;
  userdb.get(
    'SELECT * FROM Users1 WHERE user_name = ?',
    [username],
    (err, row) => {
      if (err) {
        return done(err);
      } else if (row) {
        return done(null, row);
      } else {
        userdb.run(
          'INSERT INTO Users1 (first_name, last_name, user_name, password) VALUES (?, ?, ?, ?)',
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
  // db.close();
};

module.exports = userController;
