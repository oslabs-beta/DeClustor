import React, { useEffect, useState } from 'react'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useTheme,
} from '@mui/material'
import {
  SettingsOutlined,
  ChevronLeft,
  HomeOutlined,
  PieChartOutlined,
  Draw,
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import FlexBetween from './FlexBetween'
import profileImage from '../assests/profile.png'

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
}) => {
  // grap the path that we currently at
  const { pathname } = useLocation();
  // state of currently page or track of which page is active right now
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  // from theme color
  const theme = useTheme();

  // everytime path name has changed , set the active to the current page
  useEffect(() => {
    // set to currect url and determain which page we are on
    setActive(pathname.substring(1));
  }, [pathname]);

  const navItems = [
    {
      text: 'Dashboard',
      icon: <HomeOutlined />,
    },
    // add more into the array
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
            // mui drawer paper // &
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
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSideBarOpen(!isSidebarOpen)}>
                    {/* <ChevronLeft /> */}
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            {/* creating nav items // loop thru the navItems function
                check if icon is not existed 
                then set key to text */}
            <List>
              {' '}
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      sx={{ margin: '2.25rem 0 1rem 3rem' }}
                    >
                      {text}
                    </Typography>
                  )
                }
                const lowerCaseText = text.toLowerCase()
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lowerCaseText}`)
                        setActive(lowerCaseText)
                      }}
                    ></ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  )
}

export default Sidebar
