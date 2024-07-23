import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  TextField,
  FormControlLabel,
  Grid,
  Snackbar,
  Alert,
  Checkbox,
  FormHelperText
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { setServiceName } from '../redux/userSlice';
import { updateNotification, saveNotifications } from '../redux/notificationSlice';

// Setting component for managing user notification settings.
const Setting = () => {
  const dispatch = useDispatch();
  const userId = 1;
  const accountName = "AriaLiang"; // change with redux later
  const clusterName = "DeClustor"; // change with redux later
  const region = "us-east-2"; // change with redux later
  const { notifications = [] } = useSelector((state) => state.notification);

  const [serviceNames, setServiceNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // Fetches the list of services for the given userId and updates the state.
  useEffect(() => {
    if (userId) {
      setLoading(true);
      setErrors({});

      // Fetch the list of services for the given userId, accountName, clusterName, and region
      fetch(`http://localhost:3000/list/AllServices?userId=${userId}&accountName=${accountName}&clusterName=${clusterName}&region=${region}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetching service names -->', data);
          if (data && data.length > 0) {
            setServiceNames(data);
            dispatch(setServiceName(data[0])); // Update Redux state
          } else {
            throw new Error('No services found');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching service names:', error);
          setErrors({ fetch: 'Error fetching service names' });
          setLoading(false);
        });
    }
  }, [userId, dispatch]);

  // Handles opening the settings dialog.
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handles closing the settings dialog.
  const handleClose = () => {
    setOpen(false);
  };

  // Handles closing the alert Snackbar.
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Returns the tooltip title based on the switch state
  const getTooltipTitle = (isOn) => {
    return isOn ? 'Turn off' : 'Turn on';
  };

  const operators = [
    { value: 'greaterThan', label: '>' },
    { value: 'greaterThanOrEqual', label: '>=' },
    { value: 'lessThan', label: '<' },
    { value: 'lessThanOrEqual', label: '<=' },
    { value: 'equal', label: '=' }
  ];

  // Handles saving the notification settings.
  const handleSave = async () => {
    const newErrors = {};
    let isValid = true;

    // Validate each notification
    notifications.forEach((notification, index) => {
      if (!notification.isEnable) return;

      if (!notification.operator) {
        isValid = false;
        newErrors[`operator-${index}`] = 'Operator is required';
      }
      if (notification.threshold === undefined) {
        isValid = false;
        newErrors[`threshold-${index}`] = 'Threshold is required';
      }
      if (['CPUUtilization', 'MemoryUtilization'].includes(notification.metric)) {
        if (serviceSpecificSettings[notification.metric].applyToAll) {
          if (serviceSpecificSettings[notification.metric].threshold === undefined) {
            isValid = false;
            newErrors[`threshold-${notification.metric}`] = 'Threshold is required';
          }
        } else {
          serviceSpecificSettings[notification.metric].services.forEach((service, idx) => {
            if (!service.serviceName) {
              isValid = false;
              newErrors[`serviceName-${index}-${idx}`] = 'Service name is required';
            }
            if (!service.operator) {
              isValid = false;
              newErrors[`serviceOperator-${index}-${idx}`] = 'Operator is required';
            }
            if (service.threshold === undefined) {
              isValid = false;
              newErrors[`serviceThreshold-${index}-${idx}`] = 'Threshold is required';
            }
          });
        }
      }
    });

    setErrors(newErrors);
    if (!isValid) return;

    // Prepare payload for saving notifications
    const payload = notifications.map(notification => {
      if (!notification.isEnable) {
        return { metric: notification.metric };
      }
      if (notification.metric === 'CPUUtilization' || notification.metric === 'MemoryUtilization') {
        if (serviceSpecificSettings[notification.metric].applyToAll) {
          return {
            metric: notification.metric,
            applyToAllServices: {
              threshold: serviceSpecificSettings[notification.metric].threshold,
              operator: serviceSpecificSettings[notification.metric].operator
            }
          };
        } else {
          const services = {};
          serviceSpecificSettings[notification.metric].services.forEach(service => {
            services[service.serviceName] = {
              threshold: service.threshold,
              operator: service.operator
            };
          });
          return {
            metric: notification.metric,
            services
          };
        }
      } else {
        return {
          metric: notification.metric,
          threshold: notification.threshold,
          operator: notification.operator
        };
      }
    })

    // Save notifications using Redux action
    if (userId) {
      try {
        await dispatch(saveNotifications({ userId, accountName, clusterName, region, notifications: payload })).unwrap();
        setOpen(false);
        setAlertOpen(true);
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    } else {
      console.error('User ID is undefined');
    }
  };

  // Handles toggling the "apply to all" setting for a metric.
  const [serviceSpecificSettings, setServiceSpecificSettings] = useState({
    CPUUtilization: { applyToAll: true, services: [], operator: 'greaterThan', threshold: '' },
    MemoryUtilization: { applyToAll: true, services: [], operator: 'greaterThan', threshold: '' }
  });

   /**
   * Handles toggling the "apply to all" setting for a metric.
   * @param {string} metric - The metric name.
   */
  const handleApplyToAllChange = (metric) => {
    setServiceSpecificSettings(prevSettings => ({
      ...prevSettings,
      [metric]: { ...prevSettings[metric], applyToAll: !prevSettings[metric].applyToAll }
    }));
  };

  /**
   * Handles adding a service-specific setting for a metric.
   * @param {string} metric - The metric name.
   */
  const handleAddService = (metric) => {
    setServiceSpecificSettings(prevSettings => ({
      ...prevSettings,
      [metric]: { ...prevSettings[metric], services: [...prevSettings[metric].services, { serviceName: '', operator: 'greaterThan', threshold: '' }] }
    }));
  };

  /**
   * Handles changes to service-specific settings.
   * @param {string} metric - The metric name.
   * @param {number} index - The index of the service.
   * @param {string} key - The key to update.
   * @param {any} value - The new value.
   */
  const handleServiceChange = (metric, index, key, value) => {
    const updatedServices = [...serviceSpecificSettings[metric].services];
    updatedServices[index][key] = value;
    setServiceSpecificSettings(prevSettings => ({
      ...prevSettings,
      [metric]: { ...prevSettings[metric], services: updatedServices }
    }));

    // clear error state
    const newErrors = { ...errors };
    delete newErrors[`service${key.charAt(0).toUpperCase() + key.slice(1)}-${metric}-${index}`];
    setErrors(newErrors);
  };

  /**
   * Handles deleting a service-specific setting for a metric.
   * @param {string} metric - The metric name.
   * @param {number} index - The index of the service.
   */
  const handleDeleteService = (metric, index) => {
    const updatedServices = [...serviceSpecificSettings[metric].services];
    updatedServices.splice(index, 1);
    setServiceSpecificSettings(prevSettings => ({
      ...prevSettings,
      [metric]: { ...prevSettings[metric], services: updatedServices }
    }));
  };

  /**
   * Handles changes to the operator or threshold for a metric.
   * @param {string} metric - The metric name.
   * @param {string} key - The key to update.
   * @param {any} value - The new value.
   */
  const handleOperatorThresholdChange = (metric, key, value) => {
    setServiceSpecificSettings(prevSettings => ({
      ...prevSettings,
      [metric]: { ...prevSettings[metric], [key]: value }
    }));
    
    // clear error state
    const newErrors = { ...errors };
    delete newErrors[`${key}-${metric}`];
    setErrors(newErrors);
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

          {/* Notification settings */}
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '100%',
            }}
          >
            {notifications.map((metric, index) => (
              <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }} key={metric.metric}>
                <Grid item xs={12}>
                  <Tooltip title={getTooltipTitle(metric.isEnable)}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={metric.isEnable}
                          onChange={(e) => dispatch(updateNotification({ index, key: 'isEnable', value: e.target.checked }))}
                        />
                      }
                      label={metric.metric}
                    />
                  </Tooltip>
                </Grid>
                {metric.isEnable && ['CPUUtilization', 'MemoryUtilization'].includes(metric.metric) && (
                  <>
                    <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }} key={`${metric.metric}-apply-to-all`} style={{ padding: '0 16px' }}>
                      <Grid item xs={3} container alignItems="center" justifyContent="flex-start">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={serviceSpecificSettings[metric.metric].applyToAll}
                              onChange={() => handleApplyToAllChange(metric.metric)}
                            />
                          }
                          label="Apply to all services"
                          style={{ marginRight: 0 }}
                        />
                      </Grid>
                      {serviceSpecificSettings[metric.metric].applyToAll && (
                        <>
                          <Grid item xs={4}>
                            <FormControl fullWidth error={!!errors[`operator-${index}`]}>
                              <InputLabel>Operator</InputLabel>
                              <Select
                                value={serviceSpecificSettings[metric.metric].operator}
                                onChange={(e) => handleOperatorThresholdChange(metric.metric, 'operator', e.target.value)}
                                label="Operator"
                              >
                                {operators.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors[`operator-${index}`] && (
                                <FormHelperText>{errors[`operator-${index}`]}</FormHelperText>
                              )}
                              <FormHelperText>Please select an operator</FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={5}>
                            <TextField
                              label="Threshold"
                              type="number"
                              value={serviceSpecificSettings[metric.metric].threshold}
                              onChange={(e) => handleOperatorThresholdChange(metric.metric, 'threshold', e.target.value)}
                              error={!!errors[`threshold-${metric.metric}`]}
                              helperText={errors[`threshold-${metric.metric}`] || (
                                <span style={{ whiteSpace: 'nowrap' }}>
                                  {metric.metric === 'CPUUtilization' || metric.metric === 'MemoryUtilization'
                                    ? 'Please enter a percentage (%)'
                                    : 'Please enter a number (Bytes/Second)'}
                                </span>
                              )}
                              variant="filled"
                              fullWidth
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                    {!serviceSpecificSettings[metric.metric].applyToAll && (
                      <>
                        {serviceSpecificSettings[metric.metric].services.map((service, idx) => (
                          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }} key={idx} style={{ paddingLeft: 16 }}>
                            <Grid item xs={3}>
                              <FormControl fullWidth error={!!errors[`serviceName-${index}-${idx}`]}>
                                <InputLabel htmlFor={`${metric.metric}-service-${idx}`}>Service</InputLabel>
                                <Select
                                  id={`${metric.metric}-service-${idx}`}
                                  value={service.serviceName}
                                  onChange={(e) => handleServiceChange(metric.metric, idx, 'serviceName', e.target.value)}
                                  label="Service"
                                >
                                  {serviceNames.map((serviceName) => (
                                    <MenuItem
                                      key={serviceName}
                                      value={serviceName}
                                      disabled={serviceSpecificSettings[metric.metric].services.some(s => s.serviceName === serviceName)}
                                    >
                                      {serviceName}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors[`serviceName-${index}-${idx}`] && (
                                  <FormHelperText>{errors[`serviceName-${index}-${idx}`]}</FormHelperText>
                                )}
                                <FormHelperText>Please select a service</FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                              <FormControl fullWidth error={!!errors[`serviceOperator-${index}-${idx}`]}>
                                <InputLabel>Operator</InputLabel>
                                <Select
                                  value={service.operator}
                                  onChange={(e) => handleServiceChange(metric.metric, idx, 'operator', e.target.value)}
                                  label="Operator"
                                >
                                  {operators.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors[`serviceOperator-${index}-${idx}`] && (
                                  <FormHelperText>{errors[`serviceOperator-${index}-${idx}`]}</FormHelperText>
                                )}
                                <FormHelperText>Please select an operator</FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                              <TextField
                                label="Threshold"
                                type="number"
                                value={service.threshold}
                                onChange={(e) => handleServiceChange(metric.metric, idx, 'threshold', e.target.value)}
                                error={!!errors[`serviceThreshold-${index}-${idx}`]}
                                helperText={errors[`serviceThreshold-${index}-${idx}`] || (
                                  <span style={{ whiteSpace: 'nowrap' }}>
                                    {metric.metric === 'CPUUtilization' || metric.metric === 'MemoryUtilization'
                                      ? 'Please enter a percentage (%)'
                                      : 'Please enter a number (Bytes/Second)'}
                                  </span>
                                )}
                                variant="filled"
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <Button variant="contained" color="secondary" onClick={() => handleDeleteService(metric.metric, idx)}>
                                Delete
                              </Button>
                            </Grid>
                          </Grid>
                        ))}
                        <Grid item xs={12} style={{ paddingLeft: 16 }}>
                          <Button variant="outlined" onClick={() => handleAddService(metric.metric)}>
                            + Add service
                          </Button>
                        </Grid>
                      </>
                    )}
                  </>
                )}
                {metric.isEnable && !['CPUUtilization', 'MemoryUtilization'].includes(metric.metric) && (
                  <>
                    <Grid item xs={6}>
                      <FormControl fullWidth error={!!errors[`operator-${index}`]}>
                        <InputLabel>Operator</InputLabel>
                        <Select
                          id={metric.metric}
                          value={metric.operator || 'greaterThan'}
                          onChange={(e) => dispatch(updateNotification({ index, key: 'operator', value: e.target.value }))}
                          label="Operator"
                        >
                          {operators.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[`operator-${index}`] && (
                          <FormHelperText>{errors[`operator-${index}`]}</FormHelperText>
                        )}
                        <FormHelperText>Please select an operator</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id={`${metric.metric}-number`}
                        label="Threshold"
                        type="number"
                        value={metric.threshold}
                        onChange={(e) => dispatch(updateNotification({ index, key: 'threshold', value: e.target.value }))}
                        error={!!errors[`threshold-${index}`]}
                        helperText={errors[`threshold-${index}`] || (
                          <span style={{ whiteSpace: 'nowrap' }}>
                            {metric.metric === 'CPUUtilization' || metric.metric === 'MemoryUtilization'
                              ? 'Please enter a percentage (%)'
                              : 'Please enter a number (Bytes/Second)'}
                          </span>
                        )}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="filled"
                        fullWidth
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          Notification settings have been set successfully!
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Setting;
