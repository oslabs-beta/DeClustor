import React from "react";
import { useTheme } from '@emotion/react';
import { Box, IconButton, InputBase } from '@mui/material';
import FlexBetween from './FlexBetween'
import { useDispatch } from 'react-redux'
import { setMode } from '../state/index.js'
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Search from "@mui/icons-material/Search";
import { Menu as MenuIcon } from '@mui/icons-material'
// import profileImage from '../assests/profile.png'

const Navbar = () => {
    // theme setting 
    const dispatch = useDispatch()
    const theme = useTheme()

    return (
       <Box display='flex' justifyContent='space-between' padding={2}>
        
        {/* dash menu icon button */}
        <IconButton onClick={() => console.log('open/close sidebar')}>
          <MenuIcon />
        </IconButton>

        {/* search bar */}
        <FlexBetween backgroundColor={theme.palette.background.alt} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
          <InputBase placeholder="Search..." />
          <IconButton>
            <Search />
          </IconButton>
        </FlexBetween>

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

            {/* notification icon button */}
            <IconButton>
                <NotificationsOutlinedIcon sx={{ fontSize: '25px' }}/>
            </IconButton>

              {/* setting icon button */}
            <IconButton>
              <SettingsOutlinedIcon sx={{ fontSize: '25px' }} />
            </IconButton>

            {/* profile icon button */}
            <IconButton>
                <PersonOutlinedIcon />
            </IconButton>
        </FlexBetween>

       </Box>
    )

};

export default Navbar;