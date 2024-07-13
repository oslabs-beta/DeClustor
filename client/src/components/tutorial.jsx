import React from 'react';
import { Container, Box } from '@mui/material';
import DashDemo from '../assets/dashboard.gif';

const Tutorial = () => {
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
        <img src={DashDemo} alt='Tutorial' width='100%' height='auto' />
      </Box>
    </Container>
  );
};

export default Tutorial;
