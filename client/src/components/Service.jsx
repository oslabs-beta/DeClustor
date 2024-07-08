import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, CircularProgress } from '@mui/material';
import { useTheme } from '@emotion/react';

// const options = ['Service 1', 'Service 2'];

const Service = ({ userId }) => {
  const theme = useTheme();
  const [serviceName, setServiceName] = useState(null);
  const [serviceNames, setServiceNames] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [serviceStatus, setServiceStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // set services
  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      fetch(`http://localhost:3000/listAllService?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched service names:', data);
          if (data && data.length > 0) {
            setServiceNames(data);
            setServiceName(data[0]);
          } else {
            throw new Error('No services found');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching service names:', error);
          setError('Error fetching service names');
          setLoading(false);
        });
    }
  }, [userId]);

  // set service status using WebSocket
  useEffect(() => {
    if (userId && serviceName) {
      setLoading(true);
      setError(null);

      const ws = new WebSocket(`ws://localhost:3000/getMetricData?userId=${userId}&serviceName=${serviceName}&metricName=serviceStatus`);
      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Fetched service status:', data);
        setServiceStatus(data[0] || 'UNKNOWN');
        setLoading(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Error fetching service status');
        setLoading(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };

      return () => {
        ws.close();
      };
    }
  }, [userId, serviceName]);

  return (
    <div>
      <div>{`Service: ${serviceName !== null ? `'${serviceName}'` : 'Please choose your service name'}`}</div>
      <br />
      <Autocomplete
        value={serviceName}
        onChange={(event, newValue) => {
          setServiceName(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={serviceNames}
        sx={{ minWidth: 300, maxWidth: 330 }}
        renderInput={(params) => <TextField {...params} label="Choose your service" />}
      />
      <Card sx={{ minWidth: 300, maxWidth: 330, backgroundColor: theme.palette.neutral[300], color: theme.palette.secondary[700] }}>
        <CardActionArea>
          <CardContent>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            ) : (
              <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
                Service Status: {serviceStatus || 'UNKNOWN'}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" sx={{ color: theme.palette.neutral[700], backgroundColor: theme.palette.primary[300] }} onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default Service;

