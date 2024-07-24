import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import globalReducer from './globalSlice.js';
import userReducer from './userSlice.js'; 
import notificationReducer from './notificationSlice.js';

// Configuration for persisting the Redux store
const persistConfig = {
  key: 'root',
  storage,
};

// Combine all the reducers into a rootReducer
const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  notification: notificationReducer,
});

// Create a persisted reducer using the persistConfig and rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer and configure middleware
const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, 
  }),
});

// Create a persistor for the Redux store to enable persistence
const persistor = persistStore(store);

// Export the Redux store and persistor
export { store, persistor };
