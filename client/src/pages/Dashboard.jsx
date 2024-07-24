import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart.jsx';
import {
  Box,
  useTheme,
  Typography,
  useMediaQuery,
  Breadcrumbs,
} from '@mui/material';
import PieChart from '../components/PieChart.jsx';
import Service from '../components/Service.jsx';
import StatusCard from '../components/StatusCard.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../redux/userSlice';
import BreadcrumbsNav from '../components/breadcrumbs.jsx';

const Dashboard = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width: 1200px)'); // Larger screens
  const isTabletScreen = useMediaQuery(
    '(min-width: 600px) and (max-width: 1199px)'
  ); // Tablet screens
  const { userId, accountName, region, clusterName, serviceName } = useSelector((state) => ({
    userId: state.user.userId,
    accountName: state.user.accountName,
    region: state.user.region,
    clusterName: state.user.clusterName,
    serviceName: state.user.serviceName,
  })); 
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, userId]);

  const breadcrumbsNav = [
    { name: 'Credentials', path: '/credentials' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'Cluster', path: '/clusters/:accountName' },
    { name: 'Service', path: '/dashboard/:clusterName' },
  ];
  const currentPath = '/dashboard/:clusterName';

  return (
    <Box display='flex' flexDirection='column' gap='20px'>
      <Box display='flex' flexDirection='column' gap='20px'>
        <BreadcrumbsNav
          breadcrumbs={breadcrumbsNav}
          currentPath={currentPath}
          sx={{ marginBottom: '2rem' }}
        />
        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent={isLargeScreen ? 'space-between' : 'center'}
          flexDirection={isLargeScreen ? 'row' : 'column'}
          gap='20px'
        >
          <Box
            display='flex'
            flexDirection={isLargeScreen ? 'row' : 'column'}
            justifyContent='center'
            alignItems='center'
            gap='20px'
            flex='1 1 calc(50% - 20px)'
            p='1rem'
            borderRadius='0.55rem'
            sx={{
              backgroundColor: theme.palette.background.alt,
              minWidth: isLargeScreen ? 'calc(50% - 20px)' : '100%',
            }}
          >
            <Box flex='1'>
              <Typography
                component='div'
                fontWeight='bold'
                fontSize='1.5rem'
                sx={{ color: theme.palette.secondary[300] }}
              >
                Cluster: {clusterName}
              </Typography>
              <Typography
                component='div'
                fontWeight='bold'
                fontSize='1rem'
                sx={{ color: theme.palette.secondary[100] }}
              >
                <Service
                  userId={userId}
                  accountName={accountName}
                  region={region}
                  clusterName={clusterName}
                />
              </Typography>
            </Box>
            <Box flex='1' sx={{ marginTop: '50px' }}>
              <StatusCard />
            </Box>
          </Box>

          <Box
            flex='1 1 calc(50% - 20px)'
            p='1rem'
            borderRadius='0.55rem'
            sx={{
              backgroundColor: theme.palette.background.alt,
              minWidth: isLargeScreen ? 'calc(50% - 20px)' : '100%',
            }}
          >
            <Typography
              component='div'
              fontWeight='bold'
              fontSize='0.9rem'
              sx={{ color: theme.palette.secondary[100] }}
            >
              Tasks Overview
              <PieChart
                userId={userId}
                serviceName={serviceName}
                accountName={accountName}
                region={region}
                clusterName={clusterName}
              />
            </Typography>
          </Box>
        </Box>

        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent={isLargeScreen ? 'space-between' : 'center'}
          flexDirection={isLargeScreen ? 'row' : 'column'}
          gap='20px'
        >
          <Box
            flex='1 1 calc(50% - 20px)'
            p='1rem'
            borderRadius='0.55rem'
            sx={{
              backgroundColor: theme.palette.background.alt,
              minWidth: isLargeScreen ? 'calc(50% - 20px)' : '100%',
            }}
          >
            <Typography
              component='div'
              fontWeight='bold'
              fontSize='0.9rem'
              sx={{ color: theme.palette.secondary[100] }}
            >
              CPUUtilization
              <LineChart
                userId={userId}
                serviceName={serviceName}
                accountName={accountName}
                region={region}
                clusterName={clusterName}
                metricNames={['CPUUtilization']}
              />
            </Typography>
          </Box>

          <Box
            flex='1 1 calc(50% - 20px)'
            p='1rem'
            borderRadius='0.55rem'
            sx={{
              backgroundColor: theme.palette.background.alt,
              minWidth: isLargeScreen ? 'calc(50% - 20px)' : '100%',
            }}
          >
            <Typography
              component='div'
              fontWeight='bold'
              fontSize='0.9rem'
              sx={{ color: theme.palette.secondary[100] }}
            >
              MemoryUtilization
              <LineChart
                userId={userId}
                serviceName={serviceName}
                accountName={accountName}
                region={region}
                clusterName={clusterName}
                metricNames={['MemoryUtilization']}
              />
            </Typography>
          </Box>
        </Box>

        <Box
          display='flex'
          flexWrap='wrap'
          justifyContent={isLargeScreen ? 'space-between' : 'center'}
          flexDirection={isLargeScreen ? 'row' : 'column'}
          gap='20px'
        >
          <Box
            flex='1 1 calc(50% - 20px)'
            p='1rem'
            borderRadius='0.55rem'
            sx={{
              backgroundColor: theme.palette.background.alt,
              minWidth: isLargeScreen ? 'calc(50% - 20px)' : '100%',
            }}
          >
            <Typography
              component='div'
              fontWeight='bold'
              fontSize='0.9rem'
              sx={{ color: theme.palette.secondary[100] }}
            >
              NetworkRxBytes
              <LineChart
                userId={userId}
                serviceName={serviceName}
                accountName={accountName}
                region={region}
                clusterName={clusterName}
                metricNames={['NetworkRxBytes']}
              />
            </Typography>
          </Box>

          <Box
            flex='1 1 calc(50% - 20px)'
            p='1rem'
            borderRadius='0.55rem'
            sx={{
              backgroundColor: theme.palette.background.alt,
              minWidth: isLargeScreen ? 'calc(50% - 20px)' : '100%',
            }}
          >
            <Typography
              component='div'
              fontWeight='bold'
              fontSize='0.9rem'
              sx={{ color: theme.palette.secondary[100] }}
            >
              NetworkTxBytes
              <LineChart
                userId={userId}
                serviceName={serviceName}
                accountName={accountName}
                region={region}
                clusterName={clusterName}
                metricNames={['NetworkTxBytes']}
              />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
