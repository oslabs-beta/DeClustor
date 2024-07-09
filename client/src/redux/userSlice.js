import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  username: null,
  serviceName: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log('Login successful, user data:', action.payload);
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.serviceName = action.payload.serviceName;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.username = null;
      state.userId = null;
      state.serviceName = null;
      state.error = action.payload;
    },
    signupSuccess: (state, action) => {
      console.log('Signup successful, user data:', action.payload);
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.serviceName = action.payload.serviceName;
      state.error = null;
    },
    signupFailure: (state, action) => {
      state.username = null;
      state.userId = null;
      state.serviceName = null;
      state.error = action.payload;
    },
    setServiceName: (state, action) => {
      state.serviceName = action.payload;
    },
  },
});

export const { loginSuccess, loginFailure, signupSuccess, signupFailure, setServiceName } = userSlice.actions;

export default userSlice.reducer;
