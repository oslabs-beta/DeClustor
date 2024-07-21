const sqlite3 = require('sqlite3');

const databases = {
  Accounts: './database/Accounts.db',
  Notifications: './database/Notifications.db',
  Users: './database/Users.db',
};

function connectToDatabase(dbPath) {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(`Failed to connect to database at ${dbPath}:`, err.message);
    } else {
      console.log(`Connected to database at ${dbPath}`);
    }
  });
}

const dbConnections = {};
for (const [name, path] of Object.entries(databases)) {
  dbConnections[name] = connectToDatabase(path);
}

async function createTables() {
  await dbConnections.Users.serialize(() => {
    dbConnections.Users.run(`CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      google_id TEXT,
      first_name TEXT,
      last_name TEXT,
      user_name TEXT,
      password TEXT,
      email TEXT NOT NULL UNIQUE,
      verification_code TEXT,
      verified INTEGER DEFAULT 0,
      reset_token TEXT,
      reset_token_expiry INTEGER
    )`);
  });

  await dbConnections.Accounts.serialize(() => {
    dbConnections.Accounts.run(`PRAGMA foreign_keys = ON;`);
    dbConnections.Accounts.run(`CREATE TABLE IF NOT EXISTS Accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      account_name TEXT,
      access_key TEXT,
      secret_key TEXT,
      account_type TEXT,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);
  });

  await dbConnections.Notifications.serialize(() => {
    dbConnections.Notifications.run(`PRAGMA foreign_keys = ON;`);
    dbConnections.Notifications.run(`CREATE TABLE IF NOT EXISTS Notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      account_name TEXT,
      region TEXT,
      cluster_name TEXT,
      service_name TEXT,
      metric_name TEXT,
      threshold REAL,
      operator TEXT,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);
  });
}

// Call the function to create tables
createTables();

// Close all database connections
setTimeout(() => {
  for (const connection of Object.values(dbConnections)) {
    connection.close();
  }
}, 1000);
