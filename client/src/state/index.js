import { createSlice } from '@reduxjs/toolkit'

// redux state

// declare an initial state
const initialState = {
  // set initial mode to dark
  mode: 'dark',
}

// global state
export const globalSlice = createSlice({
  name: 'global',
  // pass in initial
  initialState,
  reducers: {
    // set the mode
    setMode: (state) => {
      // check if the mode is light ? if yes, switch to dark mode
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    },
  },
});

export const { setMode } = globalSlice.actions

export default globalSlice.reducer;
