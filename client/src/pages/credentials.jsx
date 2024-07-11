import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Credentials = () => {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [region, setRegion] = useState('');
  const [clusterName, setClusterName] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  // from redux store
  const userId = useSelector((state) => state.user.userId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accessKey,
          secretKey,
          region,
          clusterName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Error in fetching credentials!');
      }

      console.log('Credentials saved successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving credentials:', error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Enter AWS Credentials
        </Typography>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            padding: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
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
              label="Access Key"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
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
              label="Secret Key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
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
              label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
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
              label="Cluster Name"
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
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
              Submit
            </Button>
            <Typography variant="body2" align="center">
              Can't find it? Return to home and read our Get Started to access
              these information.
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/')}
              sx={{ padding: 1.5 }}
            >
              Back to Home Page
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Credentials;
