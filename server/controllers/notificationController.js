const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/Notifications.db');
const userNotifications = require('../database/notificationStore');
const db = new sqlite3.Database(dbPath);

const notificationController = {};
// test data:
// [
//     {
//       "metric": "NetworkRxBytes",
//       "threshold": 20,
//       "operator": ">="
//     },
//     {
//       "metric": "NetworkTxBytes",
//       "threshold": 20,
//       "operator": ">="
//     },
//     {
//       "metric": "CPUUtilization",
//       "services": {
//         "v1": {
//           "threshold": 0,
//           "operator": ">="
//         },
//         "TEST4": {
//           "threshold": 0,
//           "operator": ">="
//         }
//       }
//     },
//     {
//       "metric": "MemoryUtilization",
//       "applyToAllServices": {
//         "threshold": 0,
//         "operator": ">="
//       }
//     }
// ]

// test url: http://localhost:3000/setNotification?userId=1
 
notificationController.setNotification = (req, res, next ) => {
    const user_id = req.query.userId;
    const body = req.body;
    if (!user_id) {
        return next({
            log: 'Missing required parameters',
            status: 400,
            message: {
              err: 'Missing required parameters'
            },
        });
    }
    try {
        // clear all existing notification for a user
        const deletequery = `DELETE FROM Notifications WHERE user_id = ?`;
        db.run(deletequery, [user_id], (err) => {
            if (err) {
                return next({
                    log: 'Error occurred during clearing notification database',
                    status: 400,
                    message: {
                        err: 'Error occurred during clearing notification database',
                    },
                });
            }
            // insert new notification settings
            const insertQueries = [];
            for (const setting of body) {
                const { metric } = setting;
                if (metric == 'NetworkRxBytes' || metric == 'NetworkTxBytes') {
                    const { threshold, operator } = setting;
                    if (!metric || threshold === undefined || !operator) {
                        return next({
                            log: 'Missing required parameters',
                            status: 400,
                            message: {
                                err: 'Missing required parameters'
                            },
                        });
                    }
                    insertQueries.push({
                        query: `INSERT INTO Notifications (user_id, metric_name, threshold, operator) VALUES (?, ?, ?, ?)`,
                        params: [user_id, metric, threshold, operator]
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
                        query: `INSERT INTO Notifications (user_id, metric_name, service_name, threshold, operator) VALUES (?, ?, ?, ?, ?)`,
                        params: [user_id, metric, 'all', threshold, operator]
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
                            query: `INSERT INTO Notifications (user_id, metric_name, service_name, threshold, operator) VALUES (?, ?, ?, ?, ?)`,
                            params: [user_id, metric, service_name, threshold, operator]
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
        })
    } catch (err) {
        return next({
            log: 'Error saving notification settings',
            status: 400,
            message: {
                err: 'Error saving notification settings',
            },
        });
    }
}

notificationController.handleNotificationCheck = async(ws, userId) => {
    // sending data
    const sendNotification = async() => {
        try {
            const notificationData = userNotifications.notificationData;
            console.log("notificationData",notificationData);
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