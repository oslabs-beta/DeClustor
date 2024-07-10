import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = (props) => {
  return (
    <Box
      component='footer'
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        textAlign: 'center',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        ...props.sx,
      }}
    >
      <Container maxWidth='sm'>
        <Typography variant='body2' color='textSecondary'>
          DeClustor © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
