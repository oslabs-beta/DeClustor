import React, { useMemo } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { themeSettings } from './theme';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import Home from './pages/Home';
import Info from './components/getstarted';
import Signup from './pages/signup';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import UserProfile from './pages/UserProfile';
import Credentials from './pages/credentials';
import GetStarted from './pages/getstarted';
import LogsNotification from './pages/LogsNotification';
import Notification from './components/Setting'; // with passing in number of notification
import Accounts from './pages/Accounts';
import AccountDetails from './components/accountDetails';
// import Overview from './pages/Overview';
// import ClusterMetrics from './pages/ClusterMetrics';

const App = () => {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/info' element={<Info />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/credentials' element={<Credentials />} />
              <Route path='/login' element={<Login />} />
              <Route path='/protected' element={<Dashboard />} />
              <Route path='/get-started' element={<GetStarted />} />
              <Route path='/userprofile' element={<UserProfile />} />
              {/* <Route path='/notification' element={<Notification />} /> */}
              <Route path='/accounts' element={<Accounts />} />
              <Route path='/dashboard' element={<AccountDetails />} />
              <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='*' element={<Navigate to='/' replace />} />
                <Route path='/logs' element={<LogsNotification />} />
              </Route>
            </Routes>
          </Box>
          <Feedback />
          <Footer sx={{ mt: 'auto' }} />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
