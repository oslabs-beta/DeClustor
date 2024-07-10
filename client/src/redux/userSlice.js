import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  serviceName: '',
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
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.serviceName = action.payload.serviceName;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.username = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.serviceName = null;
      state.error = action.payload;
    },
    signupSuccess: (state, action) => {
      console.log('Signup successful, user data:', action.payload);
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.serviceName = action.payload.serviceName;
      state.error = null;
    },
    signupFailure: (state, action) => {
      state.username = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.serviceName = null;
      state.error = action.payload;
    },
    setServiceName: (state, action) => {
      state.serviceName = action.payload;
    },
    updateProfile: (state , action) => {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      //state.email = action.payload.email;
    },
    logout: (state) => {
      state.userId = null;
      state.username = null;
      state.password = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, signupSuccess, signupFailure, setServiceName , updateProfile , logout } = userSlice.actions;

export default userSlice.reducer;
