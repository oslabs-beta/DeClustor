import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Box,
  Avatar,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signupSuccess, signupFailure } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Google from '../assets/signupgoogle.png';
import GitHub from '../assets/signupgithub.png';
import Navbar from '../components/Navbar.jsx';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const google = () => {
    window.open('http://localhost:3000/auth/google', '_self');
  };

  const github = () => {
    window.open('http://localhost:3000/auth/github', '_self');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setSuccess('Signup successful!');
        // Dispatch signup success action
        dispatch(signupSuccess({ userId: data.userId, firstName: data.firstName, lastName: data.lastName, username: data.userName, email: data.email }));
        // Navigate to credentials page after 2 seconds
        setTimeout(() => {
          navigate('/credentials');
        }, 2000);
      } else {
        setError(data.message);
        dispatch(signupFailure(data.message));
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Navbar
        showSidebar={false}
        showSearch={false}
        showNotification={false}
        showUser={false}
      />
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 0,
            marginBottom: 15,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {success}
            </Alert>
          )}
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              width: '100%',
              padding: 4,
              borderRadius: 2,
              backgroundColor: 'transparent',
              color: theme.palette.primary.contrastText,
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <TextField
                variant="outlined"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                InputLabelProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
                InputProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
              />
              <TextField
                variant="outlined"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                InputLabelProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
                InputProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
              />
              <TextField
                variant="outlined"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                InputLabelProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
                InputProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
              />
              <TextField
                variant="outlined"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputLabelProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
                InputProps={{
                  style: { color: theme.palette.primary.contrastText },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ padding: 1.5 }}
              >
                Sign Up
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 0,
                }}
              >
                <Button onClick={google} style={{ paddingBottom: '0px', marginLeft: '40px' }}>
                  <img src={Google} alt="Google" style={{ width: '135%' }} />
                </Button>
                <Button onClick={github} style={{ paddingBottom: '0px' , marginleft: '10px' }}>
                  <img src={GitHub} alt="GitHub" style={{ width: '80%' }} />
                </Button>
              </Box>
              <Button
                onClick={() => navigate('/login')}
                color="secondary"
                sx={{ mt: 0.5 }}
              >
                Already have an account? Log in!
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
