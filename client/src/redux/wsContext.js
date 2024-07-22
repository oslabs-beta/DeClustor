import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setReceivedNotifications } from '../redux/notificationSlice';

const WebSocketContext = createContext();

// global webSocket for live notification
export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // connect to check notifications endpoint
    const wsNotification = new WebSocket('ws://localhost:3000/checkNotifications?userId=1');

    wsNotification.onopen = () => {
      console.log('WebSocket connection established.');
    };

    wsNotification.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    wsNotification.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsNotification.onmessage = (event) => {
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

    setWs(wsNotification);

    return () => {
      wsNotification.close();
    };
  }, [dispatch]);

// use .Provider
  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
