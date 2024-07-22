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
import LineChart from '../components/LineChart.jsx'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setServiceName } from '../redux/userSlice.js'
import PieChart from '../components/PieChart.jsx'


const Overview = () => {
  const [serviceName, setServiceNameLocal] = useState(null)
  const [serviceNames, setServiceNames] = useState([])
  const [accountName, setAccountName] = useState('AriaLiang')
  const [clusterName, setClusterName] = useState('DeClustor')
  const [inputValueService, setInputValueService] = useState('')
  const [inputValueAccount, setInputValueAccount] = useState('')
  const [inputValueCluster, setInputValueCluster] = useState('')
  const dispatch = useDispatch()
  const userId = 1 // <= change this later
  const theme = useTheme();

// fetching services from backend
useEffect(() => {
  if (userId) {
    fetch(
      `http://localhost:3000/list/AllServices?userId=${userId}&accountName=${accountName}&clusterName=${clusterName}&region=us-east-2`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetching service names -->', data)
        if (data && data.length > 0) {
          setServiceNames(data)
          setServiceNameLocal(data[0])
          dispatch(setServiceName(data[0])) // Update Redux state
        } else {
          throw new Error('No services found')
        }
      })
      .catch((error) => {
        console.error('Error fetching service names:', error)
      })
  }
}, [userId, accountName, clusterName, dispatch])



  return (
    <Box sx={{ width: '100%' }}>

    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>

        {/* account dropdown */}
        <Autocomplete
          value={accountName}
          onChange={(event, newValue) => {
            setAccountName(newValue)
          }}
          inputValue={inputValueAccount}
          onInputChange={(event, newInputValue) => {
            setInputValueAccount(newInputValue)
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
            setClusterName(newValue)
          }}
          inputValue={inputValueCluster}
          onInputChange={(event, newInputValue) => {
            setInputValueCluster(newInputValue)
          }}
          id="cluster-name-dropdown"
          options={['DeClustor']} // change this later
          sx={{ minWidth: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Choose your cluster name" />
          )}
        />

        {/* service dropdown */}
        <Autocomplete
          value={serviceName}
          onChange={(event, newValue) => {
            setServiceNameLocal(newValue)
            dispatch(setServiceName(newValue)) // Update Redux state
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

