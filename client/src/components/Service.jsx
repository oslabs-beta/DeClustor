import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import {
  Button,
  CardActionArea,
  CardActions,
  CircularProgress,
} from '@mui/material'
import { useTheme } from '@emotion/react'
import { useDispatch } from 'react-redux'
import { setServiceName } from '../redux/userSlice.js'

/** 
 * Service component that allows users to select a service and view its status.
 * @param {Object} props - Component properties.
 * @param {string} props.userId - The ID of the user.
 */
const Service = ({ userId }) => {
  const theme = useTheme()
  const [serviceName, setServiceNameLocal] = useState(null)
  const [serviceNames, setServiceNames] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [serviceStatus, setServiceStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (userId) {
      setLoading(true)
      setError(null)

      // Fetch the list of services for the given userId
      fetch(
        `http://localhost:3000/list/AllServices?userId=1&accountName=AriaLiang&clusterName=DeClustor&region=us-east-2`
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
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching service names:', error)
          setError('Error fetching service names')
          setLoading(false)
        })
    }
  }, [userId])

  useEffect(() => {
    if (userId && serviceName) {
      setLoading(true)
      setError(null)

      // change to redux later:
      const ws = new WebSocket(
        `ws://localhost:3000/getMetricData?userId=1&accountName=AriaLiang&region=us-east-2&clusterName=DeClustor&serviceName=${serviceName}&metricName=serviceStatus`
      )
      ws.onopen = () => {
        console.log('WebSocket connection opened')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setServiceStatus(data[0] || 'UNKNOWN')
        setLoading(false)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('Error fetching service status')
        setLoading(false)
      }

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event)
      }

      // Cleanup WebSocket on component unmount
      return () => {
        ws.close()
      }
    }
  }, [userId, serviceName])

  return (
    <div>
      <div>{`Service: ${
        serviceName !== null
          ? `'${serviceName}'`
          : 'Please choose your service name'
      }`}</div>
      <br />
      <Autocomplete
        value={serviceName}
        onChange={(event, newValue) => {
          setServiceNameLocal(newValue)
          dispatch(setServiceName(newValue)) // Update Redux state
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
        }}
        id="controllable-states-demo"
        options={serviceNames}
        sx={{ minWidth: 300, maxWidth: 330 }}
        renderInput={(params) => (
          <TextField {...params} label="Choose your service" />
        )}
      />
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 330,
          backgroundColor: theme.palette.neutral[300],
          color: theme.palette.secondary[700],
        }}
      >
        <CardActionArea>
          <CardContent>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            ) : (
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                fontWeight="bold"
              >
                Service Status: {serviceStatus || 'UNKNOWN'}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button
            size="small"
            sx={{
              color: theme.palette.neutral[700],
              backgroundColor: theme.palette.primary[300],
            }}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default Service
