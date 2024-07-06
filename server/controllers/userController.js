const fs = require('fs');
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

  userdb.get('SELECT user_name FROM Users WHERE user_name = ?', [username], (err, row) => {
    if (err) {
        userdb.close();
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (row) {
        userdb.close();
      return res.status(400).json({ message: 'Username already exists' });
    }

    userdb.run('INSERT INTO Users (user_name, password) VALUES (?, ?)', [username, password], (err) => {
        // userdb.close();
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      next();
    });
  });
// use json file to store data

// const usersFilePath = path.join(__dirname, '../data/users.js');
// console.log(usersFilePath)
//   fs.readFile(usersFilePath, 'utf-8', (err, data) => {
//     if (err) {
//       return res.status(500).send('Error reading file');
//     }
//     const users = JSON.parse(data || '[]');
//     const userExists = users.some(user => user.username === username);
//     if (userExists) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }
//     users.push({ username, password});
//     console.log('this is users', users)
//     fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
//         if (err) {
//           return res.status(500).json({ message: 'Internal server error' });
//         }
//         next();
//       });
//   });
};

userController.verifyUser = (req, res, next) => {
    const { username, password } = req.body;
  
    userdb.get('SELECT * FROM Users WHERE user_name = ? AND password = ?', [username, password], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!row) {
        return res.status(400).json({ message: 'Incorrect username or password' });
      }
      next();
    });
  };
module.exports = userController;
