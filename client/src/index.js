import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { Provider } from 'react-redux';
import store from '../src/redux/store.js'


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
