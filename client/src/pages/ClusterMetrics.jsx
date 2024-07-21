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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props
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
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const ClusterMetrics = () => {
  const [value, setValue] = useState(0)
  const theme = useTheme()
  const [serviceName, setServiceNameLocal] = useState(null)
  const [serviceNames, setServiceNames] = useState([])
  const [accountName, setAccountName] = useState('AriaLiang')
  const [clusterName, setClusterName] = useState('DeClustor')
  const [inputValueService, setInputValueService] = useState('')
  const [inputValueAccount, setInputValueAccount] = useState('')
  const [inputValueCluster, setInputValueCluster] = useState('')
  const dispatch = useDispatch()
  const userId = 1 // <= change this later

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

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
          options={['DeClustor']}
          sx={{ minWidth: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Choose your cluster name" />
          )}
        />
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="CPUUtilization" {...a11yProps(0)} />
          <Tab label="MemoryUtilization" {...a11yProps(1)} />
          <Tab label="NetworkRxBytes" {...a11yProps(2)} />
          <Tab label="NetworkTxBytes" {...a11yProps(3)} />
        </Tabs>
      </Box>
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
            CPU Utilization
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              serviceName={serviceName}
              metricNames={['CPUUtilization']}
            />
          )}
        </Box>
      </CustomTabPanel>
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
            Memory Utilization
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              serviceName={serviceName}
              metricNames={['MemoryUtilization']}
            />
          )}
        </Box>
      </CustomTabPanel>
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
            Network Rx Bytes
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              serviceName={serviceName}
              metricNames={['NetworkRxBytes']}
            />
          )}
        </Box>
      </CustomTabPanel>
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
            Network Tx Bytes
          </Typography>
          {serviceName && (
            <LineChart
              userId={userId}
              serviceName={serviceName}
              metricNames={['NetworkTxBytes']}
            />
          )}
        </Box>
      </CustomTabPanel>
    </Box>
  )
}

ClusterMetrics.propTypes = {
  userId: PropTypes.string.isRequired,
}

export default ClusterMetrics
