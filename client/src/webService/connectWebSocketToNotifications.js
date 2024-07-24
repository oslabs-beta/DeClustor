import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setReceivedNotifications } from '../redux/notificationSlice';

/**
 * Custom hook for managing WebSocket connections for metrics and notifications.
 * Connects to WebSocket endpoints to receive real-time metric and notification data.
 */
const useWebSocketNotifications = () => {
  const dispatch = useDispatch();

  const { userId, accountName, region, clusterName, serviceName } = useSelector((state) => ({
    userId: state.user.userId,
    accountName: state.user.accountName,
    region: state.user.region,
    clusterName: state.user.clusterName,
    serviceName: state.user.serviceName
  })); 
  
  // Reference to hold WebSocket connections
  const metricSocketsRef = useRef([]);
  // Reference to hold WebSocket connection for notifications
  const notificationSocketRef = useRef(null);

  useEffect(() => {
    if (metricSocketsRef.current.length === 0 && !notificationSocketRef.current) {
      // URLs for WebSocket connections to receive metric data
      const metricURLs = [
        `ws://localhost:3000/getMetricData?userId=${userId}&accountName=${accountName}&region=${region}&clusterName=${clusterName}&serviceName=${serviceName}&metricName=CPUUtilization`,
        `ws://localhost:3000/getMetricData?userId=${userId}&accountName=${accountName}&region=${region}&clusterName=${clusterName}&serviceName=${serviceName}&metricName=MemoryUtilization`,
        `ws://localhost:3000/getMetricData?userId=${userId}&accountName=${accountName}&region=${region}&clusterName=${clusterName}&serviceName=${serviceName}&metricName=NetworkTxBytes`,
        `ws://localhost:3000/getMetricData?userId=${userId}&accountName=${accountName}&region=${region}&clusterName=${clusterName}&serviceName=${serviceName}&metricName=NetworkRxBytes`
      ];

      // URL for WebSocket connection to receive notifications
      const notificationURL = `ws://localhost:3000/checkNotifications?userId=${userId}`;

      /**
       * Function to create a WebSocket connection.
       * @param {string} url - The WebSocket URL to connect to.
       * @param {boolean} [isNotification=false] - Flag to indicate if the WebSocket is for notifications.
       * @returns {WebSocket} - The WebSocket connection.
       */
      function createWebSocket(url, isNotification = false) {
        const ws = new WebSocket(url);

        ws.onopen = () => {
          console.log(`WebSocket connection established: ${url}`);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (isNotification) {
              console.log('Received notification data:', data);
              if (Array.isArray(data)) {
                console.log('New notifications received:', data);
                dispatch(setReceivedNotifications(data.map(notification => ({
                  ...notification,
                  isRead: notification.isRead ?? false,
                }))));
              } else if (data.message === 'No new notifications') {
                console.log('No new notifications');
                dispatch(setReceivedNotifications([]));
              } else {
                console.error('Invalid notification data received:', data);
              }
            } else {
              console.log('Received metric data:', data);
            }
          } catch (error) {
            console.error('Failed to parse data:', event.data, error);
          }
        };

        ws.onerror = (error) => {
          console.error(`WebSocket error (${url}):`, error);
        };

        ws.onclose = () => {
          console.log(`WebSocket connection closed: ${url}`);
          // Reconnect the WebSocket after a delay
          setTimeout(() => {
            if (isNotification) {
              notificationSocketRef.current = createWebSocket(url, true);
            } else {
              metricSocketsRef.current = metricSocketsRef.current.map((ws) => {
                if (ws.url === url) {
                  return createWebSocket(url);
                }
                return ws;
              });
            }
          }, 5000); // reconnect after 5 seconds
        };

        return ws;
      }

      // Create and store WebSocket connections for metrics
      metricSocketsRef.current = metricURLs.map((url) => createWebSocket(url));
      // Create and store WebSocket connection for notifications
      notificationSocketRef.current = createWebSocket(notificationURL, true);
    }

    // Cleanup function to close WebSocket connections when the component unmounts
    return () => {
      metricSocketsRef.current.forEach((ws) => ws.close());
      if (notificationSocketRef.current) {
        notificationSocketRef.current.close();
      }
    };
  }, [dispatch]);

  return {
    metricSockets: metricSocketsRef.current,
    notificationSocket: notificationSocketRef.current,
  };
};

export default useWebSocketNotifications;
