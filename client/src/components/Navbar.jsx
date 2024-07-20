import React, { useState, useEffect } from 'react'
import { useTheme } from '@emotion/react'
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Tooltip,
  Popover,
} from '@mui/material'
import FlexBetween from './FlexBetween'
import { useDispatch, useSelector } from 'react-redux'
import { setMode } from '../redux/globalSlice.js'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import Search from '@mui/icons-material/Search'
import { Menu as MenuIcon } from '@mui/icons-material'
import Badge from '@mui/material/Badge'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout'
import logo from '../assets/logo.png'
// import Setting from './Setting'
import Setting from './setting1'
import Alerts from './Alerts'

const Navbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  showSidebar = true,
  showSearch = true,
  showNotification = true,
  showUser = true,
  // handleClickOpen,
}) => {
  // theme setting
  const dispatch = useDispatch()
  const theme = useTheme()
  const navigate = useNavigate()

  const [alertAnchorEl, setAlertAnchorEl] = useState(null)
  const notifications = useSelector(
    (state) => state.notification.receivedNotifications
  )
  const notificationCount = notifications.length;

   // Log the notification data structure
   console.log('Navbar Notifications -->', notifications);


  const handleNotificationClick = (event) => {
    setAlertAnchorEl(alertAnchorEl ? null : event.currentTarget)
  }

  const handleAlertClose = () => {
    setAlertAnchorEl(null)
  }
  useEffect(() => {
    if (alertAnchorEl) {
      const timer = setTimeout(() => {
        setAlertAnchorEl(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alertAnchorEl])

  const isAlertOpen = Boolean(alertAnchorEl)
  const hasNotifications = notifications.length > 0

  return (
    <Box display="flex" justifyContent="space-between" padding={2}>
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
          component="img"
          alt="logo"
          src={logo}
          onClick={() => {
            navigate('/dashboard')
          }}
          height="100px"
          width="100px"
          borderRadius="28%"
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
          borderRadius="9px"
          gap="3rem"
          padding="0.1rem 1.5rem"
        >
          <InputBase placeholder="Search..." />
          <IconButton>
            <Search />
          </IconButton>
        </FlexBetween>
      )}

      {/* dark/light mode , notification and profile icons */}
      <FlexBetween gap="1.5rem">
        {/* dark/light mode */}
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon sx={{ fontSize: '25px' }} />
          ) : (
            <LightModeOutlinedIcon sx={{ fontSize: '25px' }} />
          )}
        </IconButton>

          {/* Notification alert button */}
          {showNotification && (
          <IconButton onClick={handleNotificationClick}>
            {notificationCount > 0 ? (
              <Badge badgeContent={notificationCount} color="secondary">
                <NotificationsOutlinedIcon sx={{ fontSize: '25px' }} />
              </Badge>
            ) : (
              <NotificationsOutlinedIcon sx={{ fontSize: '25px' }} />
            )}
          </IconButton>
        )}

        <Popover
          open={isAlertOpen}
          anchorEl={alertAnchorEl}
          onClose={handleAlertClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Alerts open={isAlertOpen} notificationCount={notificationCount} />
        </Popover>

        {/* setting icon button */}
        <Tooltip title="Notification Setting">
          <IconButton>
            <Setting />
          </IconButton>
        </Tooltip>

        {/* profile icon button */}
        {showUser && (
          <Tooltip title="Profile">
            <IconButton onClick={() => navigate('/userprofile')}>
              <PersonOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* logout icon button */}
        <Tooltip title="Logout">
          <IconButton onClick={() => navigate('/')}>
            <LogoutIcon />
            <Typography variant="h6"></Typography>
          </IconButton>
        </Tooltip>
      </FlexBetween>

      {/* Popover for Alert component */}
      <Popover
        open={isAlertOpen}
        anchorEl={alertAnchorEl}
        onClose={handleAlertClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Alerts open={isAlertOpen} />
      </Popover>
    </Box>
  )
}

export default Navbar
