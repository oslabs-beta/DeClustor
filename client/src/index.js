import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { Provider } from 'react-redux';
import store from '../src/redux/store.js';

import { GoogleOAuthProvider } from '@react-oauth/google';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { api } from 'state/api.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId='1067747072451-8si6bdo5o4vk4arhvv74cc9m5ja7rcvf.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
