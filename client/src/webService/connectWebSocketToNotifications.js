import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setReceivedNotifications } from '../redux/notificationSlice';

const useWebSocketNotifications = () => {
  const dispatch = useDispatch();

  const metricSocketsRef = useRef([]);
  const notificationSocketRef = useRef(null);

  useEffect(() => {
    if (metricSocketsRef.current.length === 0 && !notificationSocketRef.current) {
      const metricURLs = [
        'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=CPUUtilization',
        'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=MemoryUtilization',
        'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=NetworkTxBytes',
        'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=NetworkRxBytes'
      ];

      const notificationURL = 'ws://localhost:3000/checkNotifications?userId=1';

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

      // create and store WebSocket connections
      metricSocketsRef.current = metricURLs.map((url) => createWebSocket(url));
      notificationSocketRef.current = createWebSocket(notificationURL, true);
    }

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
