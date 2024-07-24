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
          <Box component="table" sx={{ width: '100%', tableLayout: 'fixed' }}>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  Status:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {status || 'N/A'}
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  Active Services Count:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {activeServicesCount || 0}
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  Running Task Count:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {runningTasksCount || 0}
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  Pending Task Count:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {pendingTasksCount || 0}
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  Capacity Providers:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {capacityProviders?.join(', ') || 'N/A'}
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ClusterDetails;
