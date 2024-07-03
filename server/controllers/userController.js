const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const userController = {};

// const usersFilePath = path.join(__dirname, '../data/users.js');
// console.log(usersFilePath)





userController.createUser = (req, res, next) => {
  const { username, password } = req.body;
  //   console.log(username);
  if (!username || !password) {
    return res.status(400).send('Username or password is required');
  }


  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const users = JSON.parse(data || '[]');
    const userExists = users.some(user => user.username === username);

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    users.push({ username, password});
    console.log('this is users', users)
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        next();
      });
  });
};
module.exports = userController;
