// import React from 'react'
// import { Box , useTheme , Typography } from '@mui/material'
// import LineChart from '../components/LineChart.jsx';

// const ClusterMetrics = () => {
//   const theme = useTheme();
//   const userId = '1'; // Replace with actual user ID
//   const serviceName = 'v1'; // Replace with actual service name
//   const metricNames = ['CPUUtilization', 'MemoryUtilization', 'NetworkRxBytes', 'NetworkTxBytes'];

//   return (
//     <Box display="flex" flexDirection="column" gap="20px">
//       <Box
//         display="flex"
//         flexWrap="wrap"
//         justifyContent={isLargeScreen ? "space-between" : "center"}
//         flexDirection={isLargeScreen ? "row" : "column"}
//         gap="20px"
//       >
//         <Box
//           flex="1 1 calc(50% - 20px)"
//           p="1rem"
//           borderRadius="0.55rem"
//           sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
//         >
//           <Typography
//             component="div"
//             fontWeight="bold"
//             fontSize="0.9rem"
//             sx={{ color: theme.palette.secondary[100] }}
//           >
//             CPUUtilization
//             <LineChart userId={userId} serviceName={serviceName} metricNames={['CPUUtilization']} />
//           </Typography>
//         </Box>

//         <Box
//           flex="1 1 calc(50% - 20px)"
//           p="1rem"
//           borderRadius="0.55rem"
//           sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
//         >
//           <Typography
//             component="div"
//             fontWeight="bold"
//             fontSize="0.9rem"
//             sx={{ color: theme.palette.secondary[100] }}
//           >
//             MemoryUtilization
//             <LineChart userId={userId} serviceName={serviceName} metricNames={['MemoryUtilization']} />
//           </Typography>
//         </Box>
//       </Box>

//       <Box
//         display="flex"
//         flexWrap="wrap"
//         justifyContent={isLargeScreen ? "space-between" : "center"}
//         flexDirection={isLargeScreen ? "row" : "column"}
//         gap="20px"
//       >
//         <Box
//           flex="1 1 calc(50% - 20px)"
//           p="1rem"
//           borderRadius="0.55rem"
//           sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
//         >
//           <Typography
//             component="div"
//             fontWeight="bold"
//             fontSize="0.9rem"
//             sx={{ color: theme.palette.secondary[100] }}
//           >
//             NetworkRxBytes
//             <LineChart userId={userId} serviceName={serviceName} metricNames={['NetworkRxBytes']} />
//           </Typography>
//         </Box>

//         <Box
//           flex="1 1 calc(50% - 20px)"
//           p="1rem"
//           borderRadius="0.55rem"
//           sx={{ backgroundColor: theme.palette.background.alt, minWidth: isLargeScreen ? "calc(50% - 20px)" : "100%" }}
//         >
//           <Typography
//             component="div"
//             fontWeight="bold"
//             fontSize="0.9rem"
//             sx={{ color: theme.palette.secondary[100] }}
//           >
//             NetworkTxBytes
//             <LineChart userId={userId} serviceName={serviceName} metricNames={['NetworkTxBytes']} />
//           </Typography>
//         </Box>
//       </Box>
//       </Box>
  
//   )
// }

// export default ClusterMetrics;
