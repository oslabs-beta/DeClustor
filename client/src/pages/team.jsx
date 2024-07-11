import React from 'react';
import { Box, Container, Typography, Grid, Avatar , useTheme } from '@mui/material';
import grace from '../assets/grace.png';
import aria from '../assets/aria.png';
import will from '../assets/will.png';
import ploy from '../assets/ploy.png';

const teamMembers = [
  { name: 'Grace Lo', img: grace },
  { name: 'Aria Liang', img: aria },
  { name: 'Will Di', img: will },
  { name: 'Ploynapa Yang', img: ploy },
];

const Team = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 5,
        backgroundColor: 'background.secondary',
        textAlign: 'center',
      }}
    >
      <Container maxWidth='lg'>
        <Typography variant='h2' gutterBottom color={theme.palette.secondary.main}>
          Meet Our Team
        </Typography>
        <Typography variant='body1' gutterBottom color={theme.palette.secondary[100]}>
          If you have any questions about our open source project, feel free to
          reach out to us!
        </Typography>
        <Grid container spacing={2} justifyContent='center' sx={{ mt: 4 }}>
          {teamMembers.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Avatar
                src={member.img}
                alt={member.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant='h5' sx= {{ color: theme.palette.secondary[100] }} >{member.name}</Typography>
              <Typography variant='body2'>
                {member.role}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Team;
