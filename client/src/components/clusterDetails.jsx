import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const ClusterDetails = ({ cluster = {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    clusterName,
    status,
    activeServicesCount,
    runningTasksCount,
    pendingTasksCount,
    capacityProviders,
  } = cluster;

  const handleClick = () => {
    if (clusterName) {
      navigate(`/dashboard/${clusterName}`);
    } else {
      console.error('Cluster name is missing');
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: theme.palette.background.alt,
        color: theme.palette.neutral.main,
        boxShadow: theme.shadows[5],
        '&:hover': {
          boxShadow: theme.shadows[10],
        },
        borderRadius: '16px',
        width: '100%',
        height: 'auto',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardActionArea>
        <CardContent sx={{ padding: '25px' }}>
          <Typography
            variant='h4'
            component='div'
            sx={{ mb: 2, color: theme.palette.secondary.main }}
          >
            {clusterName || 'No cluster name'}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`Status: ${status || 'N/A'}`}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`Active Services Count: ${activeServicesCount || 0}`}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`Running Task Count: ${runningTasksCount || 0}`}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`Pending Task Count: ${pendingTasksCount || 0}`}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`Capacity Providers: ${capacityProviders?.join(', ') || 'N/A'}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ClusterDetails;
