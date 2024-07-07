import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import FlexBetween from './FlexBetween'
import profileImage from '../assests/profile.png'
import SsidChartOutlinedIcon from '@mui/icons-material/SsidChartOutlined'
import LanOutlinedIcon from '@mui/icons-material/LanOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import logo from '../assests/logo.png' 


{
  /* <Sidebar
isNonMobile={isNonMobile}
drawerWidth='250px'
isSidebarOpen={isSidebarOpen}
setIsSideBarOpen={setIsSideBarOpen}
/> */
}
// passin props from Layout
const Sidebar = ({
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  // user
}) => {
  // grap the path that we currently at
  const { pathname } = useLocation()
  // state of currently page or track of which page is active right now
  const [active, setActive] = useState('')
  const navigate = useNavigate()
  // from theme color
  const theme = useTheme()

  // everytime path name has changed , set the active to the current page
  useEffect(() => {
    // set to currect url and determain which page we are on
    setActive(pathname.substring(1))
  }, [pathname])

  const navItems = [
    {
      text: 'Dashboard',
      icon: <HomeOutlined />,
    },
    {
      text: 'Task Overview',
      icon: <LanOutlinedIcon />,
    },
    {
      text: 'Cluster Metics',
      icon: <SsidChartOutlinedIcon />,
    },
    {
      text: 'Service',
      icon: <AssignmentOutlinedIcon />,
    },
    {
      text: 'Logs',
      icon: <CalendarMonthOutlined />,
    },
    {
      text: 'Management',
      icon: null,
    },
    {
      text: 'Admin',
      icon: <AdminPanelSettingsOutlined />,
    },
    {
      text: 'Performance',
      icon: <TrendingUpOutlined />,
    },
  ]

  return (
    // react drawer from react dom
    // persistenr drawer
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            // class name ที่ MUI ใช้กำหนดสำหรับส่วนของ Drawer component ที่ประพฤติเหมือนกระดาษ (paper), โดยปกติจะเป็นส่วนที่เลื่อนเข้าออกได้.
            '& .MuiDrawer-paper': {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: 'border-box',
              borderWidth: isNonMobile ? 0 : '2px',
            },
          }}
        >
          <Box width="230px">
            {/* t r b l */}
            <Box margin="1.2rem 1.8rem 0.8rem 1rem" >
              <FlexBetween color={theme.palette.secondary.main}>
              <Box
                component="img"
                alt="logo"
                src={logo}
                height="100px"
                width="100px"
                borderRadius="28%"
                sx={{
                  objectFit: 'cover',
                  borderColor: theme.palette.primary[400],
                  borderStyle: 'solid', 
                  borderWidth: 1,
                  marginLeft: '47px',
                  padding: '5px'
                }}
              />
                {/* <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h3" fontWeight="bold">
                    DeClustor
                  </Typography>
                </Box> */}

                {/* responsive for mobile , it's will pop up the left arrow */}
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            {/* creating nav items // loop thru the navItems function
                check if icon is not existed 
                then set key to text */}
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: '2.25rem 0 1rem 3rem' }}>
                      {text}
                    </Typography>
                  )
                }
                
                const lowerCaseText = text.toLowerCase()

                // set the navagat by following the {text} navItems name
                // swich the colors follow by if it's active?
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lowerCaseText}`)
                        setActive(lowerCaseText)
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
                      {/* arrow right */}
                      {active === lowerCaseText && (
                        <ChevronRightOutlined sx={{ ml: 'auto' }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Box>
        
          {/* user profile need an update!*/}
          <Divider sx={{ width: '100%', maxWidth: '500px' , marginTop: '230px' }} />
          <Box position="absolute" bottom="2rem">
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="60px"
                width="60px"
                borderRadius="50%"
                sx={{ objectFit: 'cover' }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {/* change to user info !! call the api '/userProfile' ?*/}
                  Ploy
                </Typography>
              </Box>
              {/* <SettingsOutlined
                sx={{
                  color: theme.palette.secondary[300],
                  fontSize: "25px ",
                }}
              /> */}
            </FlexBetween>
          </Box>
        </Drawer>
      )}
      ;
    </Box>
  )
}

export default Sidebar
