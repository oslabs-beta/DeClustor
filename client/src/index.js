import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { Provider } from 'react-redux';
import { store, persistor } from '../src/redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { WebSocketProvider } from '../src/redux/wsContext.js'; // ws global state

// Create a root for rendering the application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // Render the application within the React-Redux Provider for state management
  <Provider store={store}>
    {/* PersistGate delays the rendering of the app's UI until the persisted state has been retrieved and saved to redux */}
    <PersistGate loading={null} persistor={persistor}>
      {/* GoogleOAuthProvider for handling Google OAuth authentication */}
      <GoogleOAuthProvider>
        {/* WebSocketProvider for managing WebSocket global state */}
        <WebSocketProvider>
          {/* Main application component */}
          <App />
        </WebSocketProvider>
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);
