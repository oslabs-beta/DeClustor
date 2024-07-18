const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/Notifications.db');
const userNotifications = require('../database/notificationStore');
const db = new sqlite3.Database(dbPath);

const notificationController = {};
// {
//     "notifications":
//         [
//             {
//                 "metric":"CPUUtilization",
//                 "applyToAllServices":
//                     {
//                         "threshold":"",
//                         "operator":"greaterThan"
//                     }
//             },
//             {
//                 "metric":"MemoryUtilization",
//                 "services":
//                     {
//                         "v1":
//                             {
//                                 "threshold":"0",
//                                 "operator":"greaterThan"
//                             }
//                     }
//             },
//             {
//                 "metric":"NetworkRxBytes",
//                 "threshold":"20",
//                 "operator":"greaterThan"
//             },
//             {
//                 "metric":"NetworkTxBytes",
//                 "threshold":"20",
//                 "operator":"greaterThan"
//             }
//         ]
//     }

// test http://localhost:3000/setNotification?userId=${userId}&accountName=${accountName}&clusterName=${clusterName}&region=${region}

notificationController.setNotification = (req, res, next) => {
    const {userId, accountName, clusterName, region } = req.query;
    if (!userId || !accountName || !clusterName || !region) {
        return next({
            log: 'Missing required parameters',
            status: 400,
            message: { err: 'Missing required parameters' },
        });
    }

    const notifications = req.body.notifications;
    // user_id INTEGER, account_name TEXT, region TEXT, cluster_name TEXT, service_name TEXT, metric_name TEXT, threshold REAL, operator TEXT,
    try {
        const deletequery = `DELETE FROM Notifications WHERE user_id = ? AND account_name = ? AND cluster_name = ? AND region = ?`;
        db.run(deletequery, [userId, accountName, clusterName, region], (err) => {
            if (err) {
                return next({
                    log: 'Error occurred during clearing notification database',
                    status: 400,
                    message: { err: 'Error occurred during clearing notification database' },
                });
            }
            // insert new notification settings
            const insertQueries = [];
            for (const setting of notifications) {
                const { metric } = setting;
                if (metric == 'NetworkRxBytes' || metric == 'NetworkTxBytes') {
                    const { threshold, operator } = setting;
                    insertQueries.push({
                        query: `INSERT INTO Notifications (user_id, account_name, cluster_name, region, metric_name, threshold, operator) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        params: [userId, accountName, clusterName, region, metric, threshold, operator]
                    })
                } else if (setting.hasOwnProperty('applyToAllServices')) {
                    const { applyToAllServices: { threshold, operator } } = setting;
                    if (threshold == undefined || !operator) {
                        return next({
                            log: 'Missing required information for applyToAllServices metric',
                            status: 400,
                            message: {
                                err: 'Missing required information for applyToAllServices metric',
                            },
                        });
                    }
                    insertQueries.push({
                        query: `INSERT INTO Notifications (user_id, account_name, cluster_name, region, service_name, metric_name, threshold, operator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        params: [userId, accountName, clusterName, region, 'all', metric, threshold, operator]
                    });
                } else if (setting.hasOwnProperty('services')) {
                    for (const [service_name, service] of Object.entries(setting.services)) {
                        const { threshold, operator } = service;
                        if (!metric || threshold === undefined || !operator || !service_name) {
                            return next({
                                log: 'Missing required information for applyToAllServices metric',
                                status: 400,
                                message: {
                                    err: 'Missing required information for applyToAllServices metric',
                                },
                            });
                        }
                        insertQueries.push({
                            query: `INSERT INTO Notifications (user_id, account_name, cluster_name, region, service_name, metric_name, threshold, operator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                            params: [userId, accountName, clusterName, region, service_name, metric, threshold, operator]
                        });
                    }
                } else {
                    return next({
                        log: 'Error metric setting',
                        status: 400,
                        message: {
                            err: 'Error metric setting',
                        },
                    });
                }
            }
            insertQueries.forEach(({ query, params }) => {
                db.run(query, params, (err) => {
                    if (err) {
                        return next({
                            log: 'Error occurred during insert notification database',
                            status: 400,
                            message: {
                                err: 'Error occurred during insert notification database',
                            },
                        });
                    }
                })
            }) 
            return next();    
        });
    } catch (err) {
        return next({
            log: 'Error saving notification settings',
            status: 400,
            message: { err: 'Error saving notification settings' },
        });
    }
};

notificationController.handleNotificationCheck = async(ws, userId) => {
    // sending data
    const sendNotification = async() => {
        try {
            const notificationData = userNotifications.notificationData;
            //console.log(notificationData);
            ws.send(JSON.stringify({notificationData}));
            userNotifications.notificationData = [];
        } catch(err) {
            ws.send(JSON.stringify({ error: 'Error getting notification data' }));
            ws.close();
            return;
        }   
    }
    sendNotification();
    const intervalId = setInterval(sendNotification, 60 * 1000); //update everyone minute

    ws.on('close', () => {
        clearInterval(intervalId);
    }); 
}

module.exports = notificationController;
