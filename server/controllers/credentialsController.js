const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const credentialsdbPath = path.resolve(__dirname, '../database/Credentials.db');
const credentialsdb = new sqlite3.Database(credentialsdbPath);

const credentialsController = {};

credentialsController.saveCredentials = (req, res, next) => {
  const { userId, accessKey, secretKey, region, clusterName } = req.body;
  // user_id, access_key, secret_key, region, clusterNmae
  if (!accessKey || !secretKey || !region || !clusterName) {
    return res.status(400).send('missing information');
  }
  credentialsdb.get(
    'SELECT access_key FROM Credentials WHERE access_key = ?',
    [accessKey],
    (err, row) => {
      if (err) {
        // userdb.close();
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (row) {
        // userdb.close();
        return res.status(400).json({ message: 'AccessKey already exists' });
      }

      credentialsdb.run(
        'INSERT INTO Credentials (user_id, access_key, secret_key, region, cluster_name) VALUES (?, ?, ?, ?, ?)',
        [userId, accessKey, secretKey, region, clusterName],
        (err) => {
          // userdb.close();
          console.log(err);
          if (err) {
            return res.status(500).json({ message: 'Internal server error' });
          }
          next();
        }
      );
    }
  );
};

module.exports = credentialsController;
