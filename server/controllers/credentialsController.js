const path = require('path');
const sqlite3 = require('sqlite3');

// resolve the path and connect to sqlite3 database
const dbPath = path.resolve(__dirname, '../database/Accounts.db');
const db = new sqlite3.Database(dbPath);

// Create a credentials controller object
const credentialsController = {};

/**
 * Saves credentials to the database
 * Checks for required fields and unique constraints on access keys and account names
 * @param {object} req - The request object containing user and account data 
 * @param {object} res - The response object 
 * @param {function} next - The next middleware function in the stack.
 * @returns {void} - Does not return a value; instead, it handles the HTTP response directly or passes control to the next middleware.
 */
credentialsController.saveCredentials = (req, res, next) => {
  const { userId, accessKey, secretKey, accountName, accountType } = req.body;
  // Validate required fields
  if (!accessKey || !secretKey || !accountName || !accountType) {
    return res.status(400).send('missing information');
  }

  // Check if the access key or account name already exists in the database
  db.get(
    'SELECT access_key, account_name FROM Accounts WHERE access_key = ? OR (user_id = ? AND account_name = ?)',
    [accessKey, userId, accountName],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: '1.Internal server error' });
      }

      // Check for existing access key or account name
      if (row) {
        if (row.access_key == accessKey) {
          return res.status(400).json({ message: 'AccessKey already exists', alreadyExist: true });
        } else if (row.account_name === accountName) {
          return res.status(400).json({ message: 'Account name already exists for this user', alreadyExist: true });
        }
        
      }

      // Insert the new account data into the Accounts table
      db.run(
        'INSERT INTO Accounts (user_id, access_key, secret_key, account_name, account_type) VALUES (?, ?, ?, ?, ?)',
        [userId, accessKey, secretKey, accountName, accountType],
        (err) => {
          if (err) {
            return res.status(500).json({ message: '2.Internal server error' });
          }
          next();
        }
      );
    }
  );
};

// Export the credentials controller
module.exports = credentialsController;
