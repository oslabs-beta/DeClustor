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
import { loginSuccess, loginFailure } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Google from '../assets/g.jpg';
import GitHub from '../assets/gh2.jpg';
import Navbar from '../components/Navbar';

const Login = () => {
  // State for username and password input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save data to local storage
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('password', password);
        console.log('saved to local storage! -->', data);

        console.log(
          'Login successful, dispatching loginSuccess with data:',
          data
        );
        dispatch(
          loginSuccess({
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.userName,
            email: data.email
          })
        );
        navigate('/dashboard');
      } else {
        dispatch(loginFailure(data.message));
        setError(data.message);
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login In
          </Typography>
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                width: '100%',
                backgroundColor: 'primary',
                color: 'white',
              }}
            >
              {error}
            </Alert>
          )}
          <Box
            component="form"
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
            {/* Email input field */}
            <TextField
              variant='outlined'
              label='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                onClick={google}
                sx={{
                  borderRadius: '50%',
                  padding: 0,
                  minWidth: '60px',
                  minHeight: '60px',
                  width: '60px',
                  height: '60px',
                  backgroundColor: theme.palette.background.default,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={Google}
                  alt="Google"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              </Button>
              <Button
                onClick={github}
                sx={{
                  borderRadius: '50%',
                  padding: 0,
                  minWidth: '60px',
                  minHeight: '60px',
                  width: '60px',
                  height: '60px',
                  backgroundColor: theme.palette.background.default,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={GitHub}
                  alt="GitHub"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
              </Button>
            </Box>
            <Button
              onClick={() => alert('Redirect to forgot password page')}
              color="secondary"
              sx={{ mt: 0.5 }}
            >
              Forgot Password?
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              color="secondary"
              sx={{ mt: 0.5 }}
            >
              Don't have an account? Sign up!
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
