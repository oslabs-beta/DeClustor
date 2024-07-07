import React, { useMemo } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  Link,
} from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { themeSettings } from './theme';
import Layout from './pages/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './components/login.jsx';
import Home from './components/home.jsx';
import Info from './components/info.jsx';
import Signup from './components/signup.jsx';

const App = () => {
  // State for mode
  const mode = useSelector((state) => state.global.mode);
  // Create a theme by using the themeSettings function then pass in the mode
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/info' element={<Info />} />
            <Route path='/signup' element={<Signup />} />
            <Route element={<Layout />}>
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>

          {/* // testing Dashboard -- start here -- */}
          {/* <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<Dashboard />} />
            </Route>
          </Routes> */}
        </ThemeProvider>
      </Router>
    </div>
  );
};

export default App;
