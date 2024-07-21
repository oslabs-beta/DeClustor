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
      operator: 'greaterThan', // default to '>'
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
  receivedNotifications: [],
  unreadNotificationCount: 0, // default to 0
  loading: false,
  error: null,
};

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
      state.unreadNotificationCount = action.payload.filter(notification => !notification.isRead).length;
    },
    clearNotificationBadge: (state) => {
      state.unreadNotificationCount = 0; // only clear badge out
    },
    markNotificationsAsRead: (state) => {
      state.receivedNotifications = state.receivedNotifications.map(notification => ({
        ...notification,
        isRead: true,
      }));
      state.unreadNotificationCount = 0; // reset unread count!!!
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveNotifications.fulfilled, (state, action) => {
        state.loading = false;
        // handle successful saving if needed
      })
      .addCase(saveNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCluster, setService, updateNotification, setNotifications, setReceivedNotifications, clearNotificationBadge, markNotificationsAsRead } = notificationSlice.actions;

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


