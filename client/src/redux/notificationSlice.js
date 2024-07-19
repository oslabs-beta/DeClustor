import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  clusters: 'allClusters',
  services: 'allServices',
  clusterOptions: [],
  serviceOptions: [],
  notifications: [
    {
      metric: 'CPUUtilization',
      threshold: 0,
      operator: 'greaterThan', // defalut to '>'
      isEnable: false,
    },
    {
      metric: 'MemoryUtilization',
      threshold: 0,
      operator: 'greaterThan',
      isEnable: false,
    },
    {
      metric: 'NetworkRxBytes',
      threshold: 0,
      operator: 'greaterThan',
      isEnable: false,
    },
    {
      metric: 'NetworkTxBytes',
      threshold: 0,
      operator: 'greaterThan',
      isEnable: false,
    },
  ],
  receivedNotifications: []
};

// export const fetchClusterAndServiceOptions = createAsyncThunk(
//   'notification/fetchClusterAndServiceOptions',
//   async (userId) => {
//     const response = await fetch(`http://localhost:3000/?userId=${userId}`); //<= change this endpoint to get all the service and cluster 
//     const data = await response.json();
//     return data;
//   }
// );

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setCluster: (state, action) => {
      state.clusters = action.payload;
    },
    setService: (state, action) => {
      state.services = action.payload;
    },
    updateNotification: (state, action) => {
      const { index, key, value } = action.payload;
      state.notifications[index][key] = value;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setReceivedNotifications: (state, action) => {
      state.receivedNotifications = action.payload;
    }
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchClusterAndServiceOptions.fulfilled, (state, action) => {
  //     state.clusterOptions = action.payload.clusters;
  //     state.serviceOptions = action.payload.services;
  //   });
  // },
});

export const { setCluster, setService, updateNotification, setNotifications, setReceivedNotifications } = notificationSlice.actions;

export const saveNotifications = createAsyncThunk(
  'notification/saveNotifications',
  async ({ userId, accountName, clusterName, region, notifications }, { rejectWithValue }) => {
    try {
      console.log('Saving notifications:', notifications);
      const response = await fetch(`http://localhost:3000/setNotification?userId=${userId}&accountName=${accountName}&clusterName=${clusterName}&region=${region}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notifications })
      });
      if (!response.ok) {
        throw new Error('Failed to save notifications');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default notificationSlice.reducer;