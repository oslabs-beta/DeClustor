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
import { useTheme } from '@mui/material/styles';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        console.log('Login successful');
        navigate('/dashboard');
      } else {
        setError(data.message);
        navigate('/signup');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);

    try {
      const response = await fetch('http://localhost:3000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        console.log('Google login successful');
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('An error occurred with Google login. Please try again.');
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Login
        </Typography>
        {error && (
          <Alert
            severity='error'
            sx={{
              mt: 2,
              width: '100%',
            }}
          >
            {error}
          </Alert>
        )}
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            width: '100%',
            padding: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Login Failed');
                  setError('Google login failed. Please try again.');
                }}
              />
            </Box>
            <TextField
              variant='outlined'
              label='Username'
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
              variant='outlined'
              label='Password'
              type='password'
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
              type='submit'
              variant='contained'
              color='secondary'
              fullWidth
              sx={{ padding: 1.5 }}
            >
              Login
            </Button>
            <Button
              onClick={() => alert('Redirect to forgot password page')}
              color='secondary'
              sx={{ mt: 0.5 }}
            >
              Forgot Password?
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              color='secondary'
              sx={{ mt: 0.5 }}
            >
              Don't have an account? Sign up!
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
