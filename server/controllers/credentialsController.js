const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../database/Accounts.db');
const db = new sqlite3.Database(dbPath);

const credentialsController = {};

credentialsController.saveCredentials = (req, res, next) => {
  const { userId, accessKey, secretKey, accountName } = req.body;
  // user_id, access_key, secret_key, accountName
  if (!accessKey || !secretKey || !accountName) {
    return res.status(400).send('missing information');
  }
  db.get(
    'SELECT access_key FROM Accounts WHERE access_key = ?',
    [accessKey],
    (err, row) => {
      if (err) {
        // userdb.close();
        return res.status(500).json({ message: '1.Internal server error' });
      }

      if (row) {
        // userdb.close();
        return res.status(400).json({ message: 'AccessKey already exists' });
      }

      db.run(
        'INSERT INTO Accounts (user_id, access_key, secret_key, account_name ) VALUES (?, ?, ?, ?)',
        [userId, accessKey, secretKey, accountName],
        (err) => {
          // userdb.close();
          console.log(err);
          if (err) {
            return res.status(500).json({ message: '2.Internal server error' });
          }
          next();
        }
      );
    }
  );
};

module.exports = credentialsController;
