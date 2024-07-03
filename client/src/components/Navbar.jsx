import React, { useState } from 'react'
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from '@mui/icons-material'
import FlexBetween from './FlexBetween'
import { useDispatch } from 'react-redux'
import { setMode } from '../state/index.js'
import profileImage from '../assests/profile.png'
import { useTheme } from '@emotion/react'
import { IconButton, InputBase, Toolbar } from '@mui/material'
import { AppBar } from '@mui/material'

const Navbar = () => {
  const dispatch = useDispatch()
  const theme = useTheme()

  // AppBar has 2 sections , left and right // space between
  // left for searching
  // right for profile

  return (
    <div>
      <AppBar
        sx={{ position: 'static', background: 'none', boxShadow: 'none' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* left side */}
          {/* for search box */}
          <FlexBetween>
            <IconButton onClick={() => console.log('open/close sidebar')}>
              <MenuIcon />
            </IconButton>
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
          </FlexBetween>

          {/* right side */}
          {/*create a button for profile and mode dark/light and setting*/}
          <FlexBetween gap="1.5rem">
            {/* when this button was clicked, it will swich to light/dark mode 
                call usDispach on th setMode to set the theme/mode*/}
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === 'dark' ? (
                <DarkModeOutlined sx={{ fontSize: '25px' }} />
              ) : (
                <LightModeOutlined sx={{ fontSize: '25px' }} />
              )}
            </IconButton>
            {/* setting button on the right*/}
            <IconButton>
              {/* call the SettingsOutlined to make the setting button */}
              <SettingsOutlined sx={{ fontSize: '25px' }} />
            </IconButton>
          </FlexBetween>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navbar
