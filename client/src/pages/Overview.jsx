import React, { useState, useEffect } from 'react'
import {
  Box,
  useTheme,
  Typography,
  Autocomplete,
  TextField,
  Tabs,
  Tab,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setServiceName, setAccountName, setClusterName, fetchAccounts, fetchClusters } from '../redux/userSlice.js'
import PieChart from '../components/PieChart.jsx'


const Overview = () => {
  const [serviceNames, setServiceNames] = useState([]);
  const [accountNames, setAccountNames] = useState([]); 
  const [clusterNames, setClusterNames] = useState([]);
  const [inputValueService, setInputValueService] = useState('')
  const [inputValueAccount, setInputValueAccount] = useState('')
  const [inputValueCluster, setInputValueCluster] = useState('')
  const dispatch = useDispatch()
  const theme = useTheme();

  const { userId, accountName, clusterName, serviceName, region } = useSelector((state) => ({
    userId: state.user.userId,
    accountName: state.user.accountName,
    clusterName: state.user.clusterName,
    serviceName: state.user.serviceName,
    region: state.user.region
  }));

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId))
        .unwrap()
        .then((data) => {
          const combinedAccountNames = [
            ...data.root.map(account => account.account_name),
            ...data.subaccount.map(account => account.account_name)
          ];
          setAccountNames(combinedAccountNames);
        })
        .catch((error) => {
          console.error('Error fetching account names:', error);
        });
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userId && accountName) {
      dispatch(fetchClusters({ userId, accountName }))
        .unwrap()
        .then((data) => {
          const clusterNames = data.flatMap(regionData => regionData.clusters.map(cluster => cluster.clusterName));
          setClusterNames(clusterNames);
        })
        .catch((error) => {
          console.error('Error fetching cluster names:', error);
        });
    }
  }, [userId, accountName, dispatch]);

  // fetching services from backend
  useEffect(() => {
    if (userId && accountName && clusterName) {
      fetch(
        `http://localhost:3000/list/AllServices?userId=${userId}&accountName=${accountName}&clusterName=${clusterName}&region=${region}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetching service names -->', data)
          if (data && data.length > 0) {
            setServiceNames(data)
            dispatch(setServiceName(data[0]));
          } else {
            setServiceNames([]); 
            dispatch(setServiceName(null));
            throw new Error('No services found')
          }
        })
        .catch((error) => {
          console.error('Error fetching service names:', error)
        })
    }
  }, [userId, accountName, clusterName, region, dispatch])



  return (
    <Box sx={{ width: '100%' }}>

    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>

        {/* account dropdown */}
        <Autocomplete
          value={accountName}
          onChange={(event, newValue) => {
            dispatch(setAccountName(newValue));
          }}
          inputValue={inputValueAccount}
          onInputChange={(event, newInputValue) => {
            setInputValueAccount(newInputValue)
          }}
          id="account-name-dropdown"
          options={accountNames}
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
            setInputValueCluster(newInputValue)
          }}
          id="cluster-name-dropdown"
          options={clusterNames} // change this later
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
            setInputValueService(newInputValue)
          }}
          id="service-name-dropdown"
          options={serviceNames}
          sx={{ minWidth: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Choose your service" />
          )}
        />
      </Box>

      {/* hightlight tab for summary  */}
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

      <PieChart />
    </Box>

  )
}

export default Overview;

