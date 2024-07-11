import React from 'react';
import { Container, Box } from '@mui/material';
import example from '../assets/example.gif';

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
        <img src={example} alt='Tutorial' width='100%' height='auto' />
      </Box>
    </Container>
  );
};

export default Tutorial;
