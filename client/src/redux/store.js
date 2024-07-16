import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './globalSlice.js';
import userReducer from './userSlice.js'; 
import notificationReducer from './notificationSlice.js'
// redux store
const store = configureStore({
    // call reducer
    reducer: {
      global: globalReducer,
      user: userReducer,
      notification: notificationReducer,
    },

});

export default store;