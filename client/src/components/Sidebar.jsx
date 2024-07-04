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

// passin props from Layout
{
  /* <Sidebar
isNonMobile={isNonMobile}
drawerWidth='250px'
isSidebarOpen={isSidebarOpen}
setIsSideBarOpen={setIsSideBarOpen}
/> */
}

const Sidebar = ({
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSideBarOpen,
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
      text: 'ECS Overview',
      icon: <SsidChartOutlinedIcon />,
    },
    {
      text: 'Cluster Matics',
      icon: <LanOutlinedIcon />,
    },
    {
      text: 'Service',
      icon: <AssignmentOutlinedIcon />,
    },
    {
      text: 'Calender',
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
          onClose={() => setIsSideBarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            // mui drawer paper
            '& .MuiDrawer-paper': {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: 'border-box',
              borderWidth: isNonMobile ? 0 : '2px',
            },
          }}
        >
          <Box width="100%">
            {/* t r b l */}
            <Box margin="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h3" fontWeight="bold">
                    DeClustor
                  </Typography>
                </Box>

                {/* responsive for mobile , it's will pop up the left arrow */}
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSideBarOpen(!isSidebarOpen)}>
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
                            ? theme.palette.secondary[300]
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

          <Box position="absolute" bottom="2rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="40px"
                width="40px"
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
