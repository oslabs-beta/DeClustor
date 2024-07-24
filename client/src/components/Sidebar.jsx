import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  CalendarMonthOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import profileImage from '../assets/profile.png';
import logo from '../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts, selectAccount, fetchSubAccountDetails } from '../redux/userSlice';
import AccountsSection from './accSection';

// passin props from Layout
const Sidebar = ({
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  // grap the path that we currently at
  const { pathname } = useLocation();
  // state of currently page or track of which page is active right now
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  // from theme color
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  console.log('user login -->', user);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

  // everytime path name has changed , set the active to the current page
  useEffect(() => {
    // set to currect url and determain which page we are on
    setActive(pathname.substring(1));
  }, [pathname]);

  // fetchAccounts from store
  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [dispatch, userId]);

  const navItems = [
    { text: 'Dashboard', icon: <HomeOutlined /> },
    { text: 'Task Overview', icon: <CalendarMonthOutlined /> },
    { text: 'Cluster Metrics', icon: <TrendingUpOutlined /> },
    { text: 'Logs', icon: <CalendarMonthOutlined /> },
    // { text: 'Setting', icon: <AdminPanelSettingsOutlined /> },
  ];

  return (
    <Box component='nav'>
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant='persistent'
          anchor='left'
          sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: 'border-box',
              borderWidth: isNonMobile ? 0 : '2px',
            },
          }}
        >
          <Box width='230px'>
            <Box margin='1.2rem 1.8rem 0.8rem 1rem'>
              <FlexBetween color={theme.palette.secondary.main}>
                <Box
                  component='img'
                  alt='logo'
                  src={logo}
                  onClick={() => navigate('/')}
                  height='100px'
                  width='100px'
                  borderRadius='28%'
                  sx={{
                    objectFit: 'cover',
                    borderColor: theme.palette.primary[400],
                    borderStyle: 'solid',
                    borderWidth: 1,
                    marginLeft: '47px',
                    padding: '5px',
                    cursor: 'pointer',
                  }}
                />
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                const lowerCaseText = text.toLowerCase().replace(' ', '');
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lowerCaseText}`);
                        setActive(lowerCaseText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lowerCaseText
                            ? theme.palette.secondary[400]
                            : 'transparent',
                        color:
                          active === lowerCaseText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: '0.8rem',
                          color:
                            active === lowerCaseText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lowerCaseText && (
                        <ChevronRightOutlined sx={{ ml: 'auto' }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            <AccountsSection userId={userId} />
          </Box>
          <Divider
            sx={{ width: '100%', maxWidth: '500px', marginTop: '230px' }}
          />
          <Box position='absolute' bottom='2rem'>
            <FlexBetween textTransform='none' gap='1rem' m='1.5rem 2rem 0 3rem'>
              <Box
                component='img'
                alt='profile'
                src={profileImage}
                height='60px'
                width='60px'
                borderRadius='50%'
                sx={{ objectFit: 'cover' }}
              />
              <Box textAlign='left'>
                <Typography
                  fontWeight='bold'
                  fontSize='0.9rem'
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user ? user.username : 'No User Data'}
                </Typography>
              </Box>
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
