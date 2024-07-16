import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  TextField,
  FormControlLabel,
  Grid,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useTheme } from '@mui/material/styles';
import { setCluster, setService, updateNotification, saveNotifications } from '../redux/notificationSlice';
//fetchClusterAndServiceOptions
import { setServiceName } from '../redux/userSlice';

const Setting = () => {
 
  const dispatch = useDispatch();
  // userId from user's state
  const userId = useSelector((state) => state.user.userId);
  // notificationSlice redux
  const {
    clusters = 'allClusters',
    services = 'allServices',
    notifications = [],
    clusterOptions = [], // setup for fetching to all services and clusters work // check again later
    serviceOptions = [] // setup for fetching to all services and clusters work // check again later
  } = useSelector((state) => state.notification);
  const [serviceNames, setServiceNames] = useState([]);
  const [serviceName, setServiceNameLocal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const theme = useTheme();

  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchClusterAndServiceOptions(userId));
  //   }
  // }, [userId, dispatch]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      fetch(`http://localhost:3000/listAllService?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetching service names -->', data);
          if (data && data.length > 0) {
            setServiceNames(data);
            setServiceNameLocal(data[0]);
            dispatch(setServiceName(data[0])); // Update Redux state
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
  }, [userId, dispatch]);

  // get clusters from backend 
  // check endpoint and logic again

  // useEffect(() => {
  //   if (userId) {
  //     setLoading(true);
  //     setError(null);

  //     fetch(`http://localhost:3000/listAllClusters?userId=${userId}`)
  //       .then(response => response.json())
  //       .then(data => {
  //         console.log('Fetching cluster names -->', data);
  //         if (data && data.length > 0) {
  //           setClusterNames(data);
  //         } else {
  //           throw new Error('No clusters found');
  //         }
  //         setLoading(false);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching cluster names:', error);
  //         setError('Error fetching cluster names');
  //         setLoading(false);
  //       });
  //   }
  // }, [userId]);

  // default cluster name for now
  const clusterNames = ['DeClustor'];  // <= don't forget to delete this later

  // set open window
  const handleClickOpen = () => {
    setOpen(true);
  };
  // if click close the window
  const handleClose = () => {
    setOpen(false);
  };
  // alert after click save 
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // turn on and turn off // enable notification setting
  const getTooltipTitle = (isOn) => {
    return isOn ? 'Turn off' : 'Turn on';
  };

  // operators
  const operators = [
    { value: 'greaterThan', label: '>' },
    { value: 'greaterThanOrEqual', label: '>=' },
    { value: 'lessThan', label: '<' },
    { value: 'lessThanOrEqual', label: '<=' },
    { value: 'equal', label: '=' }
  ];

  // save { userId,clusters,services,notifications,}
  const handleSave = async () => {
    console.log('Notifications to save -->', notifications);
    if (userId) {
      const payload = {
        userId,
        clusters,
        services,
        notifications,
      };
      try {
        await dispatch(saveNotifications(payload)).unwrap();
        setOpen(false);
        setAlertOpen(true);
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    } else {
      console.error('User ID is undefined');
    }
  };

  return (
    
    <React.Fragment>
      <IconButton onClick={handleClickOpen}>
        <SettingsOutlinedIcon sx={{ fontSize: '25px' }} />
      </IconButton>
      <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose}>
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Manage your notification settings below.
            <br />
            <br />
          </DialogContentText>

          {/* clusters dropdown menu */}
          {/* cluster has been setup , change the mock data to real endpoint later // check again if this works */}
          <FormControl sx={{ mt: 2, minWidth: 180 }}>
            <InputLabel htmlFor="clusters">Clusters</InputLabel>
            <Select
              autoFocus
              value={clusters}
              onChange={(e) => dispatch(setCluster(e.target.value))}
              label="Clusters"
              inputProps={{
                name: 'clusters',
                id: 'clusters',
              }}
            >
              <MenuItem value="allClusters">All Clusters</MenuItem>
              {clusterNames.map((cluster) => (
                <MenuItem key={cluster} value={cluster}>{cluster}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* services dropdown menu */}
          <FormControl sx={{ mt: 2, minWidth: 180 }}>
            <InputLabel htmlFor="services">Services</InputLabel>
            <Select
              autoFocus
              value={services}
              onChange={(e) => dispatch(setService(e.target.value))}
              label="Services"
              inputProps={{
                name: 'services',
                id: 'services',
              }}
            >
              <MenuItem value="allServices">All Services</MenuItem>
              {serviceNames.map((service) => (
                <MenuItem key={service} value={service}>{service}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '100%',
            }}
          >
            {/* get the operators */}
            {notifications.map((metric, index) => {
              const operatorValue = metric.operator || 'greaterThan'; // Default to 'greaterThan' // if not working check redux notificationSlice
              const helperText =
                metric.metric === 'CPUUtilization' || metric.metric === 'MemoryUtilization'
                  ? 'Please enter a percentage (%)' // cpu mem %
                  : 'Please enter a number (Bytes/Second)'; // network

              return (
                
                <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }} key={metric.metric}>
                  <Grid item xs={3}>
                    <TextField
                      id={metric.metric} // metric name
                      select
                      label={metric.metric} // metric name
                      value={operatorValue}  // operator
                      onChange={(e) => dispatch(updateNotification({ index, key: 'operator', value: e.target.value }))}
                      helperText="Please choose an operator"
                      variant="filled"
                      fullWidth
                    >
                      {/* operator dropdown menu */}
                      {operators.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  {/* input box number, key to backend ='threshold' */}
                  <Grid item xs={3}>
                    <TextField
                      id={`${metric.metric}-number`}
                      label="Number"
                      type="number"
                      value={metric.threshold}
                      onChange={(e) => dispatch(updateNotification({ index, key: 'threshold', value: e.target.value }))}
                      helperText={
                        <span style={{ whiteSpace: 'nowrap' }}>
                          {helperText}
                        </span>
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>

                  {/* enable switch */}
                  <Grid item xs={2}>
                    <Tooltip title={getTooltipTitle(metric.isEnable)}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={metric.isEnable}
                            onChange={(e) => dispatch(updateNotification({ index, key: 'isEnable', value: e.target.checked }))}
                          />
                        }
                        label="Enable"
                      />
                    </Tooltip>
                  </Grid>

                  {/* monitoring details */}
                  <Grid item xs={4}>
                    <Typography variant="body2">{metric.metric} monitoring.</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        </DialogContent>

       {/* close and save button with handle fubnction */}
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

       {/* if click save will send an alert box on the page */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          Notification settings have been set successfully!
        </Alert>
      </Snackbar>

    </React.Fragment>
  );
};

export default Setting;
