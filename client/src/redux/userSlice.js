import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  userId: 1,
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  serviceName: '',
  error: null,
  rootAccounts: [],
  subAccounts: [],
  accountsLoading: false,
  accountsError: null,
  selectedAccount: null,
  selectedAccountType: null,
  selectedSubAccountDetails: [],
  status: 'idle',
  error: null,
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
    updateProfile: (state, action) => {
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
    // New reducers for account data
    fetchAccountsSuccess: (state, action) => {
      // Store root and subaccounts including necessary fields
      state.rootAccounts = action.payload.root.map((account) => ({
        ...account,
        email: account.email || 'N/A',
        status: account.status || 'N/A',
        id: account.id || 'N/A',
      }));
      state.subAccounts = action.payload.subaccount.map((account) => ({
        ...account,
        email: account.email || 'N/A',
        status: account.status || 'N/A',
        id: account.id || 'N/A',
      }));
      state.accountsLoading = false;
      state.accountsError = null;
    },
    fetchAccountsFailure: (state, action) => {
      state.accountsLoading = false;
      state.accountsError = action.payload;
    },
    fetchAccountsPending: (state) => {
      state.accountsLoading = true;
      state.accountsError = null;
    },
    selectAccount(state, action) {
      const { account, accountType } = action.payload;
      if (accountType === 'Root') {
        state.selectedSubAccountDetails = [];
      }
    },
    clearSelectedAccount(state) {
      state.selectedAccount = null;
      state.selectedAccountType = null;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.accountsLoading = true;
        state.accountsError = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.rootAccounts = action.payload.root.map((account) => ({
          ...account,
          email: account.email || 'N/A',
          status: account.status || 'N/A',
          id: account.id || 'N/A',
        }));
        state.subAccounts = action.payload.subaccount.map((account) => ({
          ...account,
          email: account.email || 'N/A',
          status: account.status || 'N/A',
          id: account.id || 'N/A',
        }));
        state.accountsLoading = false;
        state.accountsError = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.accountsLoading = false;
        state.accountsError = action.payload;
      })
      .addCase(fetchSubAccountDetails.pending, (state) => {
        state.accountsLoading = true;
      })
      .addCase(fetchSubAccountDetails.fulfilled, (state, action) => {
        state.accountsLoading = false;
        state.selectedSubAccountDetails = action.payload.details.map(
          (detail) => ({
            ...detail,
            account_name: action.payload.accountName,
          })
        );
      })
      .addCase(fetchSubAccountDetails.rejected, (state, action) => {
        state.accountsLoading = false;
        state.accountsError = action.error.message;
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
} = userSlice.actions;

export default userSlice.reducer;
