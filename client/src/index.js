import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { Provider } from 'react-redux';
import { store, persistor } from '../src/redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { WebSocketProvider } from '../src/redux/wsContext.js'; // ws global state

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider>
          <WebSocketProvider>
            <App />
          </WebSocketProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);
