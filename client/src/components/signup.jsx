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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { signupSuccess , signupFailure } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setSuccess('Signup successful!');
        dispatch(signupSuccess({ userId: data.userId, username }));
        setTimeout(() => {
          navigate('/dashboard');
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
          Sign Up
        </Typography>
        {error && (
          <Alert severity='error' sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity='success' sx={{ mt: 2, width: '100%' }}>
            {success}
          </Alert>
        )}
        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{
            mt: 1,
            width: '80%',
            maxWidth: '400px',
            padding: 3,
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            variant='outlined'
            label='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            variant='outlined'
            label='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            variant='outlined'
            label='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            variant='outlined'
            label='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          <Button
            onClick={() => navigate('/login')}
            color='secondary'
            sx={{ mt: 0.5 }}
          >
            Already have an account? Log in!
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
