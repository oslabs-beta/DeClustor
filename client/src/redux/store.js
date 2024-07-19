import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import globalReducer from './globalSlice.js';
import userReducer from './userSlice.js'; 
import notificationReducer from './notificationSlice.js';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// redux store
const store = configureStore({
  reducer: persistedReducer, // 使用持久化的 reducer
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false, // 禁用序列化检查
  }),
});

const persistor = persistStore(store);

export { store, persistor };
