import { combineReducers } from 'redux';
import globalReducer from './globalSlice.js';
import userReducer from './userSlice.js';
import notificationReducer from './notificationSlice.js';

const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  notification: notificationReducer,
});

export { rootReducer };
