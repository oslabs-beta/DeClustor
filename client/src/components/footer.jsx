import React from 'react';
import { Box, Typography, Container ,useTheme } from '@mui/material';

const Footer = (props) => {
  const theme = useTheme();

  return (
    <Box
      component='footer'
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        backgroundColor: theme.palette.primary[700],
      }}
    >
      <Container maxWidth='sm'>
        <Typography variant='body2' color={theme.palette.secondary[100]}>
          DeClustor © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
