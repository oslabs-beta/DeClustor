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

const App = () => {
  // State for mode
  const mode = useSelector((state) => state.global.mode);
  // Create a theme by using the themeSettings function then pass in the mode
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div>
      <Router>
        <h1 className='header'>DeClustor</h1>
        <nav>
          <Link to='/'>Home</Link>
          <br />
          <Link to='/login'>Login</Link>
          <br />
          <Link to='/info'>Getting Started</Link>
        </nav>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/info' element={<Info />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </div>
  );
};

export default App;
