const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/Notifications.db');
const userNotifications = require('../database/notificationStore');
const db = new sqlite3.Database(dbPath);

const notificationController = {};
// test data:
// [
//     {
//       "metric": "networkRxBytes",
//       "threshold": 0.5,
//       "operator": "<="
//     },
//     {
//       "metric": "networkTxBytes",
//       "threshold": 0.5,
//       "operator": "<="
//     },
//     {
//       "metric": "cpuUtilization",
//       "services": {
//         "service1": {
//           "threshold": 0.5,
//           "operator": "<="
//         },
//         "service2": {
//           "threshold": 0.5,
//           "operator": "<="
//         }
//       }
//     },
//     {
//       "metric": "memoryUtilization",
//       "services": {
//         "service1": {
//           "threshold": 0.5,
//           "operator": "<="
//         },
//         "service2": {
//           "threshold": 0.5,
//           "operator": "<="
//         }
//       }
//     },
//     {
//       "metric": "serviceStatus",
//       "applyToAllServices": {
//         "threshold": 1,
//         "operator": "="
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

    //user_id INTEGER, metric_name TEXT, service_name TEXT, threshold REAL, operator TEXT,
    try {
        for (const setting of body) {
            const { metric } = setting;
            if (metric == 'networkRxBytes' || metric == 'networkTxBytes') {
                //save user_id, metric_name, threshold, operator into Notification.db   (leave service_name to be null)
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

                // check whether the threshold is exist
                db.get(`SELECT threshold FROM Notifications WHERE user_id = ? AND metric_name = ?`, 
                [user_id, metric], 
                (err, row) => {
                    if (err) {
                        return next({
                            log: 'Error occurred during query notification database',
                            status: 400,
                            message: {
                              err: 'Error occurred during query notification database'
                            },
                        });
                    }
                    if (row) {
                        // yes: modify existing threshold
                        const updateQuery = `
                            UPDATE Notifications SET threshold = ?, operator = ? 
                            WHERE user_id = ? AND metric_name = ?;
                        `
                        db.run(updateQuery, [threshold, operator, user_id, metric], (err) => {
                            if (err) {
                                return next({
                                    log: 'Error occurred during update notification database',
                                    status: 400,
                                    message: {
                                      err: 'Error occurred during update notification database'
                                    },
                                });
                            }
                        });
                    } else {
                        // no: add new
                        const insertQuery = `
                            INSERT INTO Notifications (user_id, metric_name, threshold, operator) VALUES (?, ?, ?, ?);
                        `;
                        db.run(insertQuery, [user_id, metric, threshold, operator], (err) => {
                            if (err) {
                                return next({
                                    log: 'Error occurred during insert notification database',
                                    status: 400,
                                    message: {
                                      err: 'Error occurred during insert notification database'
                                    },
                                });
                            }
                        })
                    }
                })   
            } else if (setting.hasOwnProperty('applyToAllServices')){
                //save user_id, metric_name, service_name, threshold, operator into Notification.db   (leave service_name to be all)
                const { applyToAllServices: { threshold, operator }} = setting;
                if (!threshold || !operator) {
                    return next({
                        log: 'Missing required information for applyToAllServices metric',
                        status: 400,
                        message: {
                          err: 'Missing required information for applyToAllServices metric'
                        },
                    });
                }
                const deletequery = `
                    DELETE FROM Notifications WHERE user_id = ? AND metric_name = ?;
                `;
                db.run(deletequery, [user_id, metric], (err) => {
                    if (err) {
                        return next({
                            log: 'Error occurred during delete notification database',
                            status: 400,
                            message: {
                              err: 'Error occurred during delete notification database'
                            },
                        });
                    } 

                    const insertquery = `
                    INSERT INTO Notifications (user_id, metric_name, service_name, threshold, operator) VALUES (?, ?, ?, ?, ?);
                    `;
                    db.run(insertquery, [user_id, metric, 'all', threshold, operator], (err) => {
                        if (err) {
                            return next({
                                log: 'Error occurred during insert notification database',
                                status: 400,
                                message: {
                                  err: 'Error occurred during insert notification database'
                                },
                            });
                        }
                    });
                });
            } else if (setting.hasOwnProperty('services')) {
                for (const [service_name, service] of Object.entries(setting.services)) {
                    const { threshold, operator } = service;
                    //save user_id, metric_name, service_name, threshold, operator into Notification.db   (leave service_name to be service_name)
                    if (!metric || threshold === undefined || !operator || !service_name) {
                        return next({
                            log: 'Missing required information for applyToAllServices metric',
                            status: 400,
                            message: {
                              err: 'Missing required information for applyToAllServices metric'
                            },
                        });
                    }

                    // delete rows (user_id, metric_name, service_name == service_name||all)
                    const deletequery = `
                    DELETE FROM Notifications WHERE user_id = ? AND metric_name = ? AND (service_name = ? OR service_name = 'all') ;
                    `;
                    db.run(deletequery, [user_id, metric, service_name], (err) => {
                        if (err) {
                            return next({
                                log: 'Error occurred during delete notification database',
                                status: 400,
                                message: {
                                  err: 'Error occurred during delete notification database'
                                },
                            });
                        }
                        const insertquery = `
                        INSERT INTO Notifications (user_id, metric_name, service_name, threshold, operator) VALUES (?, ?, ?, ?, ?);
                        `;
                        db.run(insertquery, [user_id, metric, service_name, threshold, operator], (err) => {
                            if (err) {
                                return next({
                                    log: 'Error occurred during insert notification database',
                                    status: 400,
                                    message: {
                                    err: 'Error occurred during insert notification database'
                                    },
                                });
                            }
                        });
                        
                    })
                }
            } else {
                return next({
                    log: 'Error metric setting',
                    status: 400,
                    message: {
                      err: 'Error metric setting'
                    },
                });
            }
        }
        return next();
    } catch(err) {
        return next({
            log: 'Error saving notification settings',
            status: 400,
            message: {
              err: 'Error saving notification settings'
            },
        });
    } 
}

notificationController.handleNotificationCheck = async(ws, userId) => {
    // sending data
    const sendNotification = async() => {
        try {
            const notificationData = userNotifications.notificationData;
            console.log(notificationData);
            if (notificationData.length > 0) {
                notificationData.forEach(notification => {
                    const message = `${notification.timestamp} -- Notification for ${notification.metricName}: Current Value is ${notification.value}, threshold is ${notification.threshold}.` + 
                            (notification.service_name ? `Service: ${notification.serviceName}` : '');
                    ws.send(JSON.stringify({message}));
                });
                userNotifications.notificationData = [];
            };
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