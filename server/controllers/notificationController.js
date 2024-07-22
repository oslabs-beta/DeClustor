const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '../database/Notifications.db');
const db = new sqlite3.Database(dbPath);

const client = require('./redisClient');

const notificationController = {};
// test http://localhost:3000/setNotification?userId=${userId}&accountName=${accountName}&clusterName=${clusterName}&region=${region}
/**
 * Sets or updates notification settings in the database for a user's account, cluster, and region.
 * It first clears any existing notifications for the specified parameters before setting new ones.
 * @param {object} req - The HTTP request object, containing the user's and notification settings in the query and body.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function in the Express stack. 
 * @returns {void} - This function does not return a value; it either calls next() with an error.
 */
notificationController.setNotification = (req, res, next) => {
    // Extract query parameters from the request
    const {userId, accountName, clusterName, region } = req.query;
    // Check if all required query parameters are provided
    if (!userId || !accountName || !clusterName || !region) {
        return next({
            log: 'Missing required parameters',
            status: 400,
            message: { err: 'Missing required parameters' },
        });
    }

    // Extract notification settings from the request body
    const notifications = req.body.notifications;
    // Attempt to delete existing notifications to prevent duplicates
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
            // Prepare to insert new notification settings
            const insertQueries = [];
            for (const setting of notifications) {
                const { metric } = setting;
                // Processing settings based on the type of metric
                if (metric == 'NetworkRxBytes' || metric == 'NetworkTxBytes') {
                    // Handling general metrics
                    if (setting.hasOwnProperty('threshold') && setting.hasOwnProperty('operator') ) {
                        const { threshold, operator } = setting;
                        insertQueries.push({
                            query: `INSERT INTO Notifications (user_id, account_name, cluster_name, region, metric_name, threshold, operator) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            params: [userId, accountName, clusterName, region, metric, threshold, operator]
                        })
                    }
                } else if (setting.hasOwnProperty('applyToAllServices')) {
                    // handling apply to all services threshold
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
                    // handling one specific service threshold
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
                }
            }
            // Execute all insert queries
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

/**
 * Retrieves notifications from Redis for a specific user and sends them via WebSocket.
 * Once sent, the notifications are deleted from Redis. If no notifications are found, a message is sent indicating this.
 * @param {WebSocket} ws - The WebSocket connection to the client. 
 * @param {number} userId - The ID of the user to check notifications for.
 * @returns {void} - This function does not return a value; it handles communication directly through WebSocket and manages its state.
 */
notificationController.handleNotificationCheck = async(ws, userId) => {
    try {
        // Retrieve notification keys from Redis
        const keys = await client.keys(`notification:${userId}:*`);;
        if (keys.length === 0) {
            ws.send(JSON.stringify({ message: 'No new notifications' }));
            return;
        }

        // Retrieve each notification and prepare to send
        const notifications = [];
        for (const key of keys) {
            const data = await client.get(key);;
            notifications.push(JSON.parse(data));
            // Delete the notification after retrieval
            await client.del(key);
        }
        // Send all notifications via WebSocket
        ws.send(JSON.stringify(notifications));
    } catch(err) {
        ws.send(JSON.stringify({error : 'Error checking notifications'}));
        ws.close();
    }
}

module.exports = notificationController;
