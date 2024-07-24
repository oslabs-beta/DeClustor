import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setReceivedNotifications } from '../redux/notificationSlice';

// Create a context for WebSocket
const WebSocketContext = createContext();

// global webSocket for live notification
export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // connect to check notifications endpoint
    const wsNotification = new WebSocket('ws://localhost:3000/checkNotifications?userId=1');

    // Event listener for WebSocket connection open
    wsNotification.onopen = () => {
      console.log('WebSocket connection established.');
    };

    // Event listener for WebSocket connection close
    wsNotification.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // Event listener for WebSocket errors
    wsNotification.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Event listener for receiving messages from the WebSocket
    wsNotification.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received notification data:', data);
      if (Array.isArray(data)) {
        // Dispatch received notifications to Redux store
        dispatch(setReceivedNotifications(data));
      } else if (data.message === 'No new notifications') {
        // Dispatch empty array if no new notifications
        dispatch(setReceivedNotifications([]));
      } else {
        console.error('Invalid notification data received:', data);
      }
    };

    // Store WebSocket instance in state
    setWs(wsNotification);

    // Cleanup function to close WebSocket connection on component unmount
    return () => {
      wsNotification.close();
    };
  }, [dispatch]);

  // Use the WebSocketContext.Provider to pass down the WebSocket instance
  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
