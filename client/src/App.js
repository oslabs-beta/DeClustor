import React, { useMemo } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { CssBaseline, ThemeProvider, Box } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { themeSettings } from './theme'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/login'
import Home from './pages/home'
import Info from './components/getstarted'
import Signup from './pages/signup'
import Feedback from './components/feedback'
import Footer from './components/footer'
import UserProfile from './pages/UserProfile'
import Credentials from './pages/credentials'
import GetStarted from './pages/getstarted'
import LogsNotification from './pages/LogsNotification'
import ClusterMetrics from './pages/ClusterMetrics'
import Overview from './pages/Overview';
import Accounts from './pages/Accounts';
import AccountDetails from './components/accountDetails';
import Clusters from './pages/clusters';
import ClusterDetails from './components/clusterDetails';

// Main application component
const App = () => {
  // Get the current theme mode from Redux store
  const mode = useSelector((state) => state.global.mode)
  // Generate the theme based on the current mode
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline to ensure consistent baseline styles */}
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
             {/* Define routes for different pages */}
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
              <Route path='/accounts' element={<Accounts />} />
              <Route path='/accounts/:accountId' element={<AccountDetails />} />
              <Route path='/clusters/:accountName' element={<Clusters />} />
               {/* Nested routes under Layout */}
              <Route element={<Layout />}>
                <Route path='/dashboard/:clusterName' element={<Dashboard />} />
                <Route
                  path='/dashboard/:accountName'
                  element={<ClusterDetails />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logs" element={<LogsNotification />} />
                <Route path="/clustermetics" element={<ClusterMetrics />} />
                <Route path="/taskoverview" element={<Overview />} />
              </Route>
            </Routes>
          </Box>
          {/* Feedback and Footer components */}
          <Feedback />
          <Footer sx={{ mt: 'auto' }} />
        </Box>
      </Router>
    </ThemeProvider>
  );
};
export default App;
