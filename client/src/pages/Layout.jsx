import React , { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
// template layout
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

const Layout = () => {
  // check the screen// if it's a mobile or not
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  // state for side bar // set default to true
  const [isSidebarOpen , setIsSideBarOpen] = useState(true);



  // responsive to mobile or computer size 
  return (
  // material ui no need {}
  // outlet is represent the child element (which is <Dashboard />)
    <Box display={isNonMobile ? 'flex' : 'block'} width='100%' height='100%'>
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth='250px'
        isSidebarOpen={isSidebarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />
  
      <Box>
        <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
  
};

export default Layout;
