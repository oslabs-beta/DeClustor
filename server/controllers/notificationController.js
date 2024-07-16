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

notificationController.setNotification = (req, res, next) => {
    const user_id = req.query.userId;
    const { clusters, services, notifications } = req.body;

    console.log('Received user_id:', user_id);
    console.log('Received clusters:', clusters);
    console.log('Received services:', services);
    console.log('Received notifications:', JSON.stringify(notifications, null, 2));

    if (!user_id) {
        return next({
            log: 'Missing required parameters',
            status: 400,
            message: { err: 'Missing required parameters' },
        });
    }

    if (!Array.isArray(notifications)) {
        return next({
            log: 'Expected an array of notifications',
            status: 400,
            message: { err: 'Expected an array of notifications' },
        });
    }

    try {
        const deletequery = `DELETE FROM Notifications WHERE user_id = ?`;
        db.run(deletequery, [user_id], (err) => {
            if (err) {
                return next({
                    log: 'Error occurred during clearing notification database',
                    status: 400,
                    message: { err: 'Error occurred during clearing notification database' },
                });
            }

            const insertQueries = [];
            for (const setting of notifications) {
                console.log('Processing setting:', setting);
                const { metric, threshold, operator } = setting;

                if (!metric) {
                    return next({
                        log: 'Missing required metric parameter',
                        status: 400,
                        message: { err: 'Missing required metric parameter' },
                    });
                }

                const effectiveOperator = operator || 'greaterThan'; // Assign a default operator if missing

                if (metric == 'NetworkRxBytes' || metric == 'NetworkTxBytes' || metric == 'CPUUtilization' || metric == 'MemoryUtilization') {
                    if (threshold === undefined) {
                        return next({
                            log: 'Missing required parameters for metric',
                            status: 400,
                            message: { err: 'Missing required parameters for metric' },
                        });
                    }
                    insertQueries.push({
                        query: `INSERT INTO Notifications (user_id, metric_name, threshold, operator) VALUES (?, ?, ?, ?)`,
                        params: [user_id, metric, threshold, effectiveOperator]
                    });
                } else {
                    return next({
                        log: 'Error metric setting: Invalid metric configuration',
                        status: 400,
                        message: { err: 'Error metric setting: Invalid metric configuration' },
                    });
                }
            }

            console.log('Insert queries:', insertQueries);

            insertQueries.forEach(({ query, params }) => {
                db.run(query, params, (err) => {
                    if (err) {
                        return next({
                            log: 'Error occurred during insert notification database',
                            status: 400,
                            message: { err: 'Error occurred during insert notification database' },
                        });
                    }
                });
            });

            return res.status(200).json({ message: 'Notification settings saved successfully!' });
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
