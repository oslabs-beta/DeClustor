import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Tutorial from '../components/Tutorial';

const GetStarted = () => {
  const theme = useTheme();

  return (
    <Container maxWidth='md'>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography component='h1' variant='h4' gutterBottom>
          Get Started
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
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 4,
            }}
          >
            <Tutorial />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default GetStarted;
