import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setReceivedNotifications } from '../redux/notificationSlice';

const connectWebSocketToNotification = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const wsURLs = [
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=CPUUtilization',
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=MemoryUtilization',
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=NetworkTxBytes',
      'ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=v1&metricName=NetworkRxBytes',
      'ws://localhost:3000/checkNotifications?userId=1'
    ];

    const connections = wsURLs.map((url) => new WebSocket(url));

    const handleMessage = (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      if (data && Array.isArray(data.notificationData)) {
        dispatch(setReceivedNotifications(data.notificationData));
      } else {
        console.error('Invalid data received:', data);
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

    connections.forEach((ws, index) => {
      ws.onmessage = handleMessage;
      ws.onopen = () => handleOpen(wsURLs[index]);
      ws.onclose = () => handleClose(wsURLs[index]);
      ws.onerror = (error) => handleError(error, wsURLs[index]);
    });

    return () => {
      connections.forEach((ws) => ws.close());
    };
  }, [dispatch]);

  return null;
};

export default connectWebSocketToNotification;
