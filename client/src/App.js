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
import Login from './components/Login';
import Home from './pages/Home';
import Info from './components/Info';
import Signup from './components/Signup';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import Overview from './pages/Overview';
import ClusterMetrics from './pages/ClusterMetrics';

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
              <Route element={<Layout />}>
                <Route
                  path='/'
                  element={<Navigate to='/dashboard' replace />}
                />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/dashboard' element={<Overview />} />
                <Route path='/dashboard' element={<ClusterMetrics />} />
              </Route>
              <Route path='*' element={<Navigate to='/' replace />} />
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
