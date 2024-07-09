import React , { useState , useEffect } from 'react';
import LineChart from '../components/LineChart.jsx';
import { Box, useTheme , Typography , useMediaQuery } from "@mui/material";
import { themeSettings as theme } from '../theme.js';
//import FlexBetween from '../components/FlexBetween'
import PieChart from '../components/PieChart.jsx';
import Service from '../components/Service.jsx';
import StatusCard from '../components/StatusCard.jsx';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery("(min-width: 1200px)"); // Change to larger screens
  const isTabletScreen = useMediaQuery("(min-width: 600px) and (max-width: 1199px)"); // Change for tablet screens
  const userId = useSelector((state) => state.user.userId); // Get userId from Redux store
  const serviceName = useSelector((state) => state.user.serviceName); // Get serviceName from Redux store  const metricNames = ['CPUUtilization', 'MemoryUtilization', 'NetworkRxBytes', 'NetworkTxBytes'];

  return (
    <Box display="flex" flexDirection="column" gap="20px">
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent={isLargeScreen ? "space-between" : "center"}
      flexDirection={isLargeScreen ? "row" : "column"}
      gap="20px"
    >
      <Box
        display="flex"
        flexDirection={isLargeScreen ? "row" : "column"}
        justifyContent="center"
        alignItems="center"
        gap="20px"
        flex="1 1 calc(50% - 20px)"
        p="1rem"
        borderRadius="0.55rem"
        sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
      >
        <Box flex="1">
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="1.5rem"
            sx={{ color: theme.palette.secondary[300] }}
          >
            Cluster: DeClustor
            </Typography>
            <Typography
            component="div"
            fontWeight="bold"
            fontSize="1rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            <Service userId={userId}/>
          </Typography>
        </Box>
        <Box flex="1" sx={{ marginTop: '50px' }}>
          <StatusCard />
        </Box>
      </Box>

      <Box
        flex="1 1 calc(50% - 20px)"
        p="1rem"
        borderRadius="0.55rem"
        sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
      >
        <Typography
          component="div"
          fontWeight="bold"
          fontSize="0.9rem"
          sx={{ color: theme.palette.secondary[100] }}
        >
          Tasks Overview
          <PieChart userId={userId} serviceName={serviceName} />
        </Typography>
      </Box>
    </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent={isLargeScreen ? "space-between" : "center"}
        flexDirection={isLargeScreen ? "row" : "column"}
        gap="20px"
      >
        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            CPUUtilization
            <LineChart userId={userId} serviceName={serviceName} metricNames={['CPUUtilization']} />
          </Typography>
        </Box>

        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            MemoryUtilization
            <LineChart userId={userId} serviceName={serviceName} metricNames={['MemoryUtilization']} />
          </Typography>
        </Box>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent={isLargeScreen ? "space-between" : "center"}
        flexDirection={isLargeScreen ? "row" : "column"}
        gap="20px"
      >
        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            NetworkRxBytes
            <LineChart userId={userId} serviceName={serviceName} metricNames={['NetworkRxBytes']} />
          </Typography>
        </Box>

        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            NetworkTxBytes
            <LineChart userId={userId} serviceName={serviceName} metricNames={['NetworkTxBytes']} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;