import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setReceivedNotifications } from '../redux/notificationSlice';

const useWebSocketNotifications = (dependency) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const metricURLs = [
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=CPUUtilization',
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=MemoryUtilization',
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=NetworkTxBytes',
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=NetworkRxBytes'
    ];

    const notificationURL = 'ws://localhost:3000/checkNotifications?userId=1';

    const metricConnections = metricURLs.map((url) => new WebSocket(url));
    const notificationConnection = new WebSocket(notificationURL);

    const handleMetricMessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received metric data:', data);
    };

    const handleNotificationMessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received notification data:', data);
      if (Array.isArray(data)) {
        dispatch(setReceivedNotifications(data));
      } else if (data.message === 'No new notifications') {
        dispatch(setReceivedNotifications([])); 
      } else {
        console.error('Invalid notification data received:', data);
      }
    };

    const handleOpen = (url) => {
      console.log(`WebSocket connection established: ${url}`);
    };

    const handleClose = (url) => {
      console.log(`WebSocket connection closed: ${url}`);
    };

    const handleError = (error, url) => {
      console.error(`WebSocket error (${url}):`, error);
    };

    metricConnections.forEach((ws, index) => {
      ws.onmessage = handleMetricMessage;
      ws.onopen = () => handleOpen(metricURLs[index]);
      ws.onclose = () => handleClose(metricURLs[index]);
      ws.onerror = (error) => handleError(error, metricURLs[index]);
    });

    notificationConnection.onmessage = handleNotificationMessage;
    notificationConnection.onopen = () => handleOpen(notificationURL);
    notificationConnection.onclose = () => handleClose(notificationURL);
    notificationConnection.onerror = (error) => handleError(error, notificationURL);

    return () => {
      metricConnections.forEach((ws) => ws.close());
      notificationConnection.close();
    };
  }, [dispatch, dependency]);
};

export default useWebSocketNotifications;
