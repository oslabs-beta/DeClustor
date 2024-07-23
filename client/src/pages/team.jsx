import React from 'react';
import { Box, Container, Typography, Grid, Avatar , useTheme } from '@mui/material';
import grace from '../assets/grace.png';
import aria from '../assets/aria.png';
import will from '../assets/will.png';
import ploy from '../assets/ploy.png';

// Array of team member objects with their names and image paths
const teamMembers = [
  { name: 'Grace Lo', img: grace },
  { name: 'Aria Liang', img: aria },
  { name: 'Will Di', img: will },
  { name: 'Ploynapa Yang', img: ploy },
];

// Team component
const Team = () => {
  const theme = useTheme(); // Hook to access the current theme

  return (
    <Box
      sx={{
        py: 5,
        backgroundColor: 'background.secondary',
        textAlign: 'center',
      }}
    >
      <Container maxWidth='lg'>
        {/* Main heading */}
        <Typography variant='h2' gutterBottom color={theme.palette.secondary.main}>
          Meet Our Team
        </Typography>
        {/* Subheading */}
        <Typography variant='body1' gutterBottom color={theme.palette.secondary[100]}>
          If you have any questions about our open source project, feel free to
          reach out to us!
        </Typography>
        {/* Grid container for team members */}
        <Grid container spacing={2} justifyContent='center' sx={{ mt: 4 }}>
          {/* Mapping over team members array to create a grid item for each member */}
          {teamMembers.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Avatar
                src={member.img}
                alt={member.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              {/* Team member's name */}
              <Typography variant='h5' sx= {{ color: theme.palette.secondary[100] }} >{member.name}</Typography>
              {/* Placeholder for team member's role */}
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
