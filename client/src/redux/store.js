import { configureStore } from '@reduxjs/toolkit';
import globalReducer from './globalSlice.js';
import userReducer from './userSlice.js'; 

// redux store
const store = configureStore({
    // call reducer
    reducer: {
      global: globalReducer,
      user: userReducer,
    },

});

export default store;