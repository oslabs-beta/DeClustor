import React, { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Tooltip,
  Badge,
} from '@mui/material';
import FlexBetween from './FlexBetween';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../redux/globalSlice';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Search from '@mui/icons-material/Search';
import { Menu as MenuIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../assets/logo.png';
import Setting from './Setting';
import {
  clearNotificationBadge,
  markNotificationsAsRead,
} from '../redux/notificationSlice';
import { useNavigate } from 'react-router-dom';
//import Alerts from './Alerts'
// import { useWebSocket } from '../redux/wsContext'  // <= keep this for now , ws global
const Navbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  showSidebar = true,
  showSearch = true,
  showNotification = true,
  showUser = true,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const [alertAnchorEl, setAlertAnchorEl] = useState(null);
  // unread redux state
  const unreadNotificationCount = useSelector(
    (state) => state.notification.unreadNotificationCount
  );
  useEffect(() => {
    if (alertAnchorEl) {
      const timer = setTimeout(() => {
        setAlertAnchorEl(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertAnchorEl]);
  // make sure the state update happens before navigation // not time lapping
  const handleNotificationClick = (event) => {
    if (unreadNotificationCount > 0) {
      // mark and clare redux state
      dispatch(markNotificationsAsRead());
      dispatch(clearNotificationBadge());
      setTimeout(() => {
        navigate('/logs');
      }, 0);
    }
  };
  // const handleAlertClose = () => {
  //   setAlertAnchorEl(null)
  // }
  //const isAlertOpen = Boolean(alertAnchorEl)
  return (
    <Box display='flex' justifyContent='space-between' padding={2}>
      {/* hide the sidebar */}
      {showSidebar ? (
        <IconButton
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          sx={{
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Box
          component='img'
          alt='logo'
          src={logo}
          onClick={() => navigate('/dashboard')}
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
      )}

      {/* search bar */}
      {showSearch && (
        <FlexBetween
          backgroundColor={theme.palette.background.alt}
          borderRadius='9px'
          gap='3rem'
          padding='0.1rem 1.5rem'
        >
          <InputBase placeholder='Search...' />
          <IconButton>
            <Search />
          </IconButton>
        </FlexBetween>
      )}

      {/* dark/light mode , notification and profile icons */}
      <FlexBetween gap='1.5rem'>
        {/* dark/light mode */}
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon sx={{ fontSize: '25px' }} />
          ) : (
            <LightModeOutlinedIcon sx={{ fontSize: '25px' }} />
          )}
        </IconButton>

        {/* Notification alert button */}
        {/* check if there is no unread .length, tooltip box equals no notification */}
        {showNotification && (
          <Tooltip
            title={
              unreadNotificationCount > 0
                ? 'You have notifications!'
                : 'No notifications'
            }
          >

            {/* handle notification  */}
            <IconButton onClick={handleNotificationClick}>
              {unreadNotificationCount > 0 ? (
                <Badge badgeContent={unreadNotificationCount} color='secondary'>
                  <NotificationsOutlinedIcon sx={{ fontSize: '25px' }} />
                </Badge>
              ) : (
                <NotificationsOutlinedIcon sx={{ fontSize: '25px' }} />
              )}
            </IconButton>
          </Tooltip>
        )}

        {/* setting icon button */}
        {showUser && (
        <Tooltip title='Notification Setting'>
          <IconButton>
            <Setting />
          </IconButton>
        </Tooltip>
        )}
        {/* profile icon button */}
        {showUser && (
          <Tooltip title='Profile'>
            <IconButton onClick={() => navigate('/userprofile')}>
              <PersonOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
        {/* logout icon button */}
        <Tooltip title='Logout'>
          <IconButton onClick={() => navigate('/')}>
            <LogoutIcon />
            <Typography variant='h6'></Typography>
          </IconButton>
        </Tooltip>
      </FlexBetween>
    </Box>
  );
};
export default Navbar;
