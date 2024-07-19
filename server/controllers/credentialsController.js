const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../database/Accounts.db');
const db = new sqlite3.Database(dbPath);

const credentialsController = {};

credentialsController.saveCredentials = (req, res, next) => {
  const { userId, accessKey, secretKey, accountName, accountType } = req.body;
  // user_id, access_key, secret_key, accountName
  if (!accessKey || !secretKey || !accountName || !accountType) {
    return res.status(400).send('missing information');
  }
  db.get(
    'SELECT access_key, account_name FROM Accounts WHERE access_key = ? OR (user_id = ? AND account_name = ?)',
    [accessKey, userId, accountName],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: '1.Internal server error' });
      }

      if (row) {
        if (row.access_key == accessKey) {
          return res.status(400).json({ message: 'AccessKey already exists', alreayExist: true });
        } else if (row.account_name === accountName) {
          return res.status(400).json({ message: 'Account name already exists for this user', alreadyExist: true });
        }
        
      }

      db.run(
        'INSERT INTO Accounts (user_id, access_key, secret_key, account_name, account_type) VALUES (?, ?, ?, ?, ?)',
        [userId, accessKey, secretKey, accountName, accountType],
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
