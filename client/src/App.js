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
// import Overview from './pages/Overview';
// import ClusterMetrics from './pages/ClusterMetrics';
import Credentials from './pages/credentials';
import { GoogleLogin } from '@react-oauth/google';

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
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/info" element={<Info />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/credentials" element={<Credentials />} />
              <Route path="/login" element={<Login />} />
              <Route path="/protected" element={<Dashboard />} />
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/dashboard" element={<Overview />} /> */}
                {/* <Route path="/clustermetics" element={<ClusterMetrics />} /> */}
                {/* <Route path="/dashboard" element={<Dashboard />}> */}
                  {/* <Route path="overview" element={<Overview />} />
                  <Route path="cluster-metrics" element={<ClusterMetrics />} /> */}
                {/* </Route> */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
              <Route path="/userprofile" element={<UserProfile />} />
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
