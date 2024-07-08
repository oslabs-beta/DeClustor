const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const userdbPath = path.resolve(__dirname, '../database/Users.db');
const userdb = new sqlite3.Database(userdbPath);

const userController = {};

userController.createUser = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username or password is required');
  }

  userdb.get(
    'SELECT user_name FROM Users WHERE user_name = ?',
    [username],
    (err, row) => {
      if (err) {
        // userdb.close();
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (row) {
        // userdb.close();
        return res.status(400).json({ message: 'Username already exists' });
      }

      userdb.run(
        'INSERT INTO Users (user_name, password) VALUES (?, ?)',
        [username, password],
        (err) => {
          // userdb.close();
          if (err) {
            return res.status(500).json({ message: 'Internal server error' });
          }
          // res.locals.userId = this.lastID;
          // console.log(res.locals.userId);
          userdb.get(
            'SELECT id FROM Users WHERE user_name = ?',
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
    'SELECT * FROM Users WHERE user_name = ? AND password = ?',
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
      next();
    }
  );
};
module.exports = userController;
