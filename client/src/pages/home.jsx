import React from 'react'
import {
  Container,
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import nobglogo from '../assets/nobglogo.png'
import LoginIcon from '@mui/icons-material/Login'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import GettingStartedIcon from '@mui/icons-material/PlayCircleOutline'
import Team from './team'
import { useDispatch } from 'react-redux'
import { setMode } from '../redux/globalSlice.js'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'

const Home = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const dispatch = useDispatch()

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: theme.palette.primary[700] }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src={nobglogo}
              alt="AWS ECS Cluster Monitor"
              style={{ height: '90px', marginRight: '10px' }}
            />
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              startIcon={<HomeOutlinedIcon sx={{ fontSize: '1.8rem' }} />}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                color: theme.palette.secondary[100],
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/getting-started')}
              startIcon={<GettingStartedIcon sx={{ fontSize: '1.8rem' }} />}
              sx={{
                textTransform: 'none',
                fontSize: '1rem',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                color: theme.palette.secondary[100],
              }}
            >
              Get Started
            </Button>
          </Box>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlinedIcon sx={{ fontSize: '25px' }} />
            ) : (
              <LightModeOutlinedIcon sx={{ fontSize: '25px' }} />
            )}
          </IconButton>
          <Button
            color="inherit"
            onClick={() => navigate('/login')}
            startIcon={<LoginIcon sx={{ fontSize: '1.8rem' }} />}
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '4px',
              color: theme.palette.secondary[100],
            }}
          >
            Login/Signup
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography
          variant="h2"
          gutterBottom
          color={theme.palette.secondary.main}
        >
          DeClustor
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          color={theme.palette.secondary[100]}
        >
          Welcome to DeClustor, your centralized solution for monitoring and
          managing ECS environments on AWS. Track metrics and monitor real-time
          performance across multiple ECS clusters effortlessly.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/signup')}
          sx={{ mt: 4, color: theme.palette.secondary[100] }}
        >
          Get Started
        </Button>
      </Container>
      <Box sx={{ mt: 8 }}>
        <Team />
      </Box>
    </>
  )
}

export default Home
