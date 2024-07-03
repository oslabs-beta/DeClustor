import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './state';
import { Provider } from 'react-redux';

// redux store
const store = configureStore({
  // call reducer
  reducer: {
    global: globalReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
