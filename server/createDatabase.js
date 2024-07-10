const sqlite3 = require('sqlite3').verbose();

const databases = {
  Users: './database/Users1.db',
  Credentials: './database/Credentials.db',
  Notifications: './database/Notifications.db'
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
    // dbConnections.Users.run(`DROP TABLE IF EXISTS Users`, (err) => {
    //   if (err) {
    //     console.error('Error dropping Users table:', err.message);
    //   }
    // });

    // dbConnections.Users.run(`CREATE TABLE IF NOT EXISTS Users (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   first_name TEXT,
    //   last_name TEXT,
    //   user_name TEXT,
    //   password TEXT
    // )`);

    dbConnections.Users.run(`CREATE TABLE Users1 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      user_name TEXT,
      password TEXT
    )`);

   // dbConnections.Users.run(
    //   `ALTER TABLE Users ADD COLUMN first_name TEXT`,
    //   (err) => {
    //     if (err && !err.message.includes('duplicate column name')) {
    //       console.error('Error adding first_name column:', err.message);
    //     }
    //   }
    // );

    // dbConnections.Users.run(
    //   `ALTER TABLE Users ADD COLUMN last_name TEXT`,
    //   (err) => {
    //     if (err && !err.message.includes('duplicate column name')) {
    //       console.error('Error adding last_name column:', err.message);
    //     }
    //   }
    // );
  });

  await dbConnections.Credentials.serialize(() => {
    dbConnections.Credentials.run(`PRAGMA foreign_keys = ON;`);
    dbConnections.Credentials.run(`CREATE TABLE IF NOT EXISTS Credentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      access_key TEXT,
      secret_key TEXT,
      region TEXT,
      cluster_name TEXT,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);
  });

  await dbConnections.Notifications.serialize(() => {
    dbConnections.Notifications.run(`PRAGMA foreign_keys = ON;`);
    dbConnections.Notifications.run(`CREATE TABLE IF NOT EXISTS Notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      metric_name TEXT,
      service_name TEXT,
      threshold REAL,
      operator TEXT,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);
  })
}

// Call the function to create tables
createTables();

// Close all database connections
setTimeout(() => {
  for (const connection of Object.values(dbConnections)) {
    connection.close();
  }
}, 1000);
