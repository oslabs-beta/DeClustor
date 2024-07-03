const sqlite3 = require('sqlite3').verbose();
//create and connect to database
const Userdb = new sqlite3.Database('./database/Users.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to Users database');
});
const Credentialdb = new sqlite3.Database('./database/Credentials.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to Credentials database');
});
const Clusterdb = new sqlite3.Database('./database/Clusters.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to Clusters database');
});
const Servicedb = new sqlite3.Database('./database/Services.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to Services database');
});
const Taskdb = new sqlite3.Database('./database/Tasks.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to Tasks database');
});
const ClusterMetricdb = new sqlite3.Database('./database/ClusterMetrics.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to ClusterMetrics database');
});
const ServiceMetricdb = new sqlite3.Database('./database/ServiceMetrics.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to ServiceMetrics database');
});
const TaskMetricdb = new sqlite3.Database('./database/TaskMetrics.db', (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log('Connected to TaskMetrics database');
})
//create User database
Userdb.serialize(() => {
    Userdb.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT,
        password INTEGER
      )`);
});
Credentialdb.serialize(() => {
    Credentialdb.run(`PRAGMA foreign_keys = ON;`);
    Credentialdb.run(`CREATE TABLE IF NOT EXISTS Credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        access_key TEXT,
        secret_key TEXT,
        region TEXT,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);
});
Clusterdb.serialize(() => {
    Clusterdb.run(`PRAGMA foreign_keys = ON;`);
    Clusterdb.run(`CREATE TABLE IF NOT EXISTS Clusters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);
})
Servicedb.serialize(() => {
    Servicedb.run(`PRAGMA foreign_keys = ON;`);
    Servicedb.run(`CREATE TABLE IF NOT EXISTS Services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        cluster_id INTEGER,
        FOREIGN KEY (cluster_id) REFERENCES Clusters(id)
    )`);
});
Taskdb.serialize(() => {
    Taskdb.run(`PRAGMA foreign_keys = ON;`);
    Taskdb.run(`CREATE TABLE IF NOT EXISTS Tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        arn TEXT,
        service_id INTEGER,
        FOREIGN KEY (service_id) REFERENCES Services(id)
    )`);
});
ClusterMetricdb.serialize(() => {
    ClusterMetricdb.run(`PRAGMA foreign_keys = ON;`)
    ClusterMetricdb.run(`CREATE TABLE IF NOT EXISTS ClusterMetrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_name TEXT,
      cluster_id INTEGER,
      average REAL,
      sum REAL,
      minimum REAL,
      maximum REAL,
      unit TEXT,
      timestamp TEXT,
      FOREIGN KEY (cluster_id) REFERENCES Clusters(id)
    )`);
});
ServiceMetricdb.serialize(() => {
    ServiceMetricdb.run(`CREATE TABLE IF NOT EXISTS ServiceMetrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_name TEXT,
      service_id INTEGER,
      average REAL,
      sum REAL,
      minimum REAL,
      maximum REAL,
      unit TEXT,
      timestamp TEXT,
      status TEXT,
      FOREIGN KEY (service_id) REFERENCES Services(id)
    )`);
});
TaskMetricdb.serialize(() => {
    TaskMetricdb.run(`CREATE TABLE IF NOT EXISTS TaskMetrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_name TEXT,
      task_id INTEGER,
      timestamp TEXT,
      status TEXT,
      FOREIGN KEY (task_id) REFERENCES Tasks(id)
    )`);
});
Userdb.close();
Credentialdb.close();
Clusterdb.close();
Servicedb.close();
Taskdb.close();
ClusterMetricdb.close();
ServiceMetricdb.close();
TaskMetricdb.close();