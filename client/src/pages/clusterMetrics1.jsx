import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  Typography,
  Autocomplete,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import LineChart from '../components/LineChart.jsx';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setServiceName, setAccountName, setClusterName } from '../redux/userSlice.js';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ClusterMetrics = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [inputValueService, setInputValueService] = useState('');
  const [inputValueAccount, setInputValueAccount] = useState('');
  const [inputValueCluster, setInputValueCluster] = useState('');
  const [serviceNames, setServiceNames] = useState([]); // 本地状态
  const dispatch = useDispatch();

  const { userId, accountName, region, clusterName, serviceName } = useSelector((state) => ({
    userId: state.user.userId,
    region: state.user.region,
    accountName: state.user.accountName,
    clusterName: state.user.clusterName,
    serviceName: state.user.serviceName,
  }));

  useEffect(() => {
    if (userId && accountName && clusterName) {
      fetch(
        `http://localhost:3000/list/AllServices?userId=${userId}&accountName=${accountName}&clusterName=${clusterName}&region=${region}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetching service names -->', data);
          if (data && data.length > 0) {
            setServiceNames(data);
            dispatch(setServiceName(data[0])); // Update Redux state
          } else {
            throw new Error('No services found');
          }
        })
        .catch((error) => {
          console.error('Error fetching service names:', error);
        });
    }
  }, [userId, accountName, clusterName, region, dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* dropdown menu */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {/* account dropdown */}
        <Autocomplete
          value={accountName}
          onChange={(event, newValue) => {
            dispatch(setAccountName(newValue));
          }}
          inputValue={inputValueAccount}
          onInputChange={(event, newInputValue) => {
            setInputValueAccount(newInputValue);
          }}
          id="account-name-dropdown"
          options={['Aria Liang']}
          sx={{ minWidth: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Choose your account name" />
          )}
        />

        {/* cluster dropdown */}
        <Autocomplete
          value={clusterName}
          onChange={(event, newValue) => {
            dispatch(setClusterName(newValue));
          }}
          inputValue={inputValueCluster}
          onInputChange={(event, newInputValue) => {
            setInputValueCluster(newInputValue);
          }}
          id="cluster-name-dropdown"
          options={['']}
          sx={{ minWidth: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Choose your cluster name" />
          )}
        />

        {/* service dropdown */}
        <Autocomplete
          value={serviceName}
          onChange={(event, newValue) => {
            dispatch(setServiceName(newValue));
          }}
          inputValue={inputValueService}
          onInputChange={(event, newInputValue) => {
            setInputValueService(newInputValue);
          }}
          id="service-name-dropdown"
          options={serviceNames}
          sx={{ minWidth: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Choose your service" />
          )}
        />
      </Box>

      {/* hightlight tab for summary */}
      <Box
        sx={{
          p: 2,
          backgroundColor: theme.palette.secondary[300],
          borderRadius: 1,
          mb: 3,
          color: theme.palette.primary[700],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body1">
          <strong>Account:</strong>{' '}
          {accountName !== null
            ? accountName
            : 'Please choose your account name'}{' '}
          | <strong>Cluster:</strong>{' '}
          {clusterName !== null
            ? clusterName
            : 'Please choose your cluster name'}{' '}
          | <strong>Service:</strong>{' '}
          {serviceName !== null
            ? serviceName
            : 'Please choose your service name'}
        </Typography>
      </Box>

      {/* tabpanel for metrics options */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {/* tab label options function */}
          <Tab label="CPUUtilization" {...a11yProps(0)} />
          <Tab label="MemoryUtilization" {...a11yProps(1)} />
          <Tab label="NetworkRxBytes" {...a11yProps(2)} />
          <Tab label="NetworkTxBytes" {...a11yProps(3)} />
        </Tabs>
      </Box>

      {/* CPU Utilization */}
      <CustomTabPanel value={value} index={0}>
        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{
            backgroundColor: theme.palette.background.alt,
            minWidth: 'calc(50% - 20px)',
          }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            CPUUtilization
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              accountName={accountName}
              region={region}
              clusterName={clusterName}
              serviceName={serviceName}
              metricNames={['CPUUtilization']}
            />
          )}
        </Box>
      </CustomTabPanel>

      {/* MemoryUtilization */}
      <CustomTabPanel value={value} index={1}>
        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{
            backgroundColor: theme.palette.background.alt,
            minWidth: 'calc(50% - 20px)',
          }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            MemoryUtilization
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              accountName={accountName}
              region={region}
              clusterName={clusterName}
              serviceName={serviceName}
              metricNames={['MemoryUtilization']}
            />
          )}
        </Box>
      </CustomTabPanel>

      {/* NetworkRxBytes */}
      <CustomTabPanel value={value} index={2}>
        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{
            backgroundColor: theme.palette.background.alt,
            minWidth: 'calc(50% - 20px)',
          }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            NetworkRxBytes
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              accountName={accountName}
              region={region}
              clusterName={clusterName}
              serviceName={serviceName}
              metricNames={['NetworkRxBytes']}
            />
          )}
        </Box>
      </CustomTabPanel>

      {/* NetworkTxBytes */}
      <CustomTabPanel value={value} index={3}>
        <Box
          flex="1 1 calc(50% - 20px)"
          p="1rem"
          borderRadius="0.55rem"
          sx={{
            backgroundColor: theme.palette.background.alt,
            minWidth: 'calc(50% - 20px)',
          }}
        >
          <Typography
            component="div"
            fontWeight="bold"
            fontSize="0.9rem"
            sx={{ color: theme.palette.secondary[100] }}
          >
            NetworkTxBytes
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              accountName={accountName}
              region={region}
              clusterName={clusterName}
              serviceName={serviceName}
              metricNames={['NetworkTxBytes']}
            />
          )}
        </Box>
      </CustomTabPanel>
    </Box>
  );
};

export default ClusterMetrics;
