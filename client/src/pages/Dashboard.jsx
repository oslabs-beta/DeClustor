import React , { useState , useEffect } from 'react';
import LineChart from '../components/LineChart.jsx';
//client/src/components/LineChart.jsx
import { mockLineData } from '../data/mockData'; 
import { Box, useTheme , Typography } from "@mui/material";
import { themeSettings as theme } from '../theme.js';
//import FlexBetween from '../components/FlexBetween'
import PieChart from '../components/PieChart.jsx';
import { mockPieData } from '../data/mockData'; 
import { fetchMetrics } from '../state/api.js'

const Dashboard = () => {

  const theme = useTheme();
  const userId = 'ploy'; // Replace with actual user ID
  const serviceName = 'yourServiceName'; // Replace with actual service name
  const metricNames = ['CPUUtilization', 'MemoryUtilization', 'NetworkRxBytes', 'NetworkTxBytes'];

  
  // note: change <div> later if want to split into flex

  return (
    <div>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt , marginRight: '20px' , marginBottom: '50px' }}
        >
           <Typography
           component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
           >
          Tasks Overview
           <PieChart data={mockPieData} />
          </Typography>
        </Box>

      <Box
          gridColumn="span 8"
          gridRow="span 2"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt , marginRight: '20px' , marginBottom: '50px' }}
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
          gridColumn="span 8"
          gridRow="span 2"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt , marginRight: '20px', marginBottom: '50px' }}
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

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt , marginRight: '20px', marginBottom: '50px' }}
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
          gridColumn="span 8"
          gridRow="span 2"
          p="1rem"
          borderRadius="0.55rem"
          sx={{ backgroundColor: theme.palette.background.alt , marginRight: '20px', marginBottom: '50px' }}
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

    </div>
  );

};

export default Dashboard;
