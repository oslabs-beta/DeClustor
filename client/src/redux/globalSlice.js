import { createSlice } from '@reduxjs/toolkit';

// declare an initial state
const initialState = {
  // set initial mode to dark
  mode: 'dark',
  // add userId from database
  // userId: '123', // <= change this later
};

// global state
export const globalSlice = createSlice({
  name: 'global',
  // pass in initial
  initialState,
  reducers: {
    // set the mode
    setMode: (state) => {
      // check if the mode is light ? if yes, switch to dark mode
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;
