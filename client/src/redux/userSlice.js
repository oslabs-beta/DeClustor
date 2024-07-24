import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Initial state for the user slice
const initialState = {
  userId: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  serviceName: '',
  email: '',
  error: null,
  // account
  rootAccounts: [],
  subAccounts: [],
  accountsLoading: false,
  accountsError: null,
  selectedAccount: null,
  selectedAccountType: null,
  selectedSubAccountDetails: [],
  status: 'idle',
  // clusters
  clusters: [],
  clustersLoading: false,
  clustersError: null,
  selectedCluster: null,
};

// Async thunk for fetching current user data
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/api/current_user', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Could not fetch user data');
      }
      const data = await response.json();
      const user = data.user;
      dispatch(
        loginSuccess({
          userId: user.id,
          username: user.user_name,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          serviceName: user.service_name || '',
        })
      );
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch accounts async thunk using fetch
export const fetchAccounts = createAsyncThunk(
  'user/fetchAccounts',
  async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/list/allAccounts?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch accounts: ' + error.message);
    }
  }
);

// Fetch subaccount details
export const fetchSubAccountDetails = createAsyncThunk(
  'user/fetchSubAccountDetails',
  async ({ userId, accountName }) => {
    try {
      const response = await fetch(
        `http://localhost:3000/list/AllSubAccounts?userId=${userId}&accountName=${accountName}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return { accountName, details: data };
    } catch (error) {
      throw new Error('Failed to fetch subaccount details: ' + error.message);
    }
  }
);

// Fetch clusters
export const fetchClusters = createAsyncThunk(
  'cluster/fetchClusters',
  async ({ userId, accountName }, { rejectWithValue }) => {
    if (!userId || !accountName) {
      return rejectWithValue('User ID and account name are required');
    }
    try {
      const response = await fetch(
        `http://localhost:3000/list/AllClusters?userId=${userId}&accountName=${accountName}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        return rejectWithValue(
          `Network response was not ok: ${response.statusText} - ${errorText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch clusters: ' + error.message);
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducer for successful login
    loginSuccess: (state, action) => {
      console.log('Login successful, user data:', action.payload);
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.error = null;
    },
    // Reducer for login failure
    loginFailure: (state, action) => {
      state.username = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.error = action.payload;
    },
    // Reducer for successful signup
    signupSuccess: (state, action) => {
      console.log('Signup successful, user data:', action.payload);
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.error = null;
    },
    // Reducer for signup failure
    signupFailure: (state, action) => {
      state.username = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.error = action.payload;
    },
    // Reducer for setting the service name
    setServiceName: (state, action) => {
      state.serviceName = action.payload;
    },
    // Reducer for updating user profile
    updateProfile: (state, action) => {
      state.username = action.payload.username;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
    },
    // Reducer for logging out the user
    logout: (state) => {
      state.userId = null;
      state.username = null;
      state.password = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.error = null;
    },
   // Reducers for account data
    fetchAccountsSuccess: (state, action) => {
      // Store root and subaccounts including necessary fields
      state.rootAccounts = action.payload.root.map((account) => ({
        ...account,
        email: account.email || 'N/A',
        status: account.status || 'N/A',
        id: account.id || 'N/A',
      }));
      // Map through the subaccounts in the payload and ensure required fields are populated
      state.subAccounts = action.payload.subaccount.map((account) => ({
        ...account,
        email: account.email || 'N/A',
        status: account.status || 'N/A',
        id: account.id || 'N/A',
      }));
      state.accountsLoading = false;
      state.accountsError = null;
    },
    // Reducer to handle fetch accounts failure
    fetchAccountsFailure: (state, action) => {
      state.accountsLoading = false;
      state.accountsError = action.payload;
    },
    // Reducer to handle pending fetch accounts request
    fetchAccountsPending: (state) => {
      state.accountsLoading = true;
      state.accountsError = null;
    },
    // Reducer to handle account selection
    selectAccount(state, action) {
      const { account, accountType } = action.payload;
      state.selectedAccount = account.account_name;
      if (accountType === 'Root') {
        state.selectedAccountType = 'Root';
        // state.selectedSubAccountDetails = [];
        state.clusters = [];  
      } else {
        state.selectedAccountType = 'Sub';
        state.subAccounts = [];
      }
    },
    // Reducer to clear the selected account
    clearSelectedAccount(state) {
      state.selectedAccount = null;
      state.selectedAccountType = null;
    },
    // Reducer to set the user ID
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    // Reducer to select a cluster
    selectCluster: (state, action) => {
      state.selectedCluster = action.payload;
    },
  },
  // Extra reducers for handling asynchronous actions
  extraReducers: (builder) => {
    builder
    // Handle fetchAccounts pending state
      .addCase(fetchAccounts.pending, (state) => {
        state.accountsLoading = true;
        state.accountsError = null;
      })
      // Handle fetchAccounts fulfilled state
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        // Map through the root accounts and ensure required fields are populated
        state.rootAccounts = action.payload.root.map((account) => ({
          ...account,
          email: account.email || 'N/A',
          status: account.status || 'N/A',
          id: account.id || 'N/A',
        }));
        // Map through the subaccounts and ensure required fields are populated
        state.subAccounts = action.payload.subaccount.map((account) => ({
          ...account,
          email: account.email || 'N/A',
          status: account.status || 'N/A',
          id: account.id || 'N/A',
        }));
        state.accountsLoading = false;
        state.accountsError = null;
      })
      // Handle fetchAccounts rejected state
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.accountsLoading = false;
        state.accountsError = action.payload;
      })
      // Handle fetchSubAccountDetails pending state
      .addCase(fetchSubAccountDetails.pending, (state) => {
        state.accountsLoading = true;
      })
      // Handle fetchSubAccountDetails fulfilled state
      .addCase(fetchSubAccountDetails.fulfilled, (state, action) => {
        state.accountsLoading = false;
        state.selectedSubAccountDetails = action.payload.details.map(
          (detail) => ({
            ...detail,
            account_name: action.payload.accountName,
          })
        );
      })
      // Handle fetchSubAccountDetails rejected state
      .addCase(fetchSubAccountDetails.rejected, (state, action) => {
        state.accountsLoading = false;
        state.accountsError = action.error.message;
      })
      // Handle fetchClusters pending state
      .addCase(fetchClusters.pending, (state) => {
        state.clustersLoading = true;
        state.clustersError = null;
      })
       // Handle fetchClusters fulfilled state
      .addCase(fetchClusters.fulfilled, (state, action) => {
        state.clustersLoading = false;
        state.clusters = action.payload;
      })
      // Handle fetchClusters rejected state
      .addCase(fetchClusters.rejected, (state, action) => {
        state.clustersLoading = false;
        state.clustersError = action.payload;
      });
  },
});

export const {
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  setServiceName,
  updateProfile,
  logout,
  fetchAccountsSuccess,
  fetchAccountsFailure,
  fetchAccountsPending,
  selectAccount,
  clearSelectedAccount,
  setUserId,
  selectCluster,
} = userSlice.actions;

export default userSlice.reducer;
