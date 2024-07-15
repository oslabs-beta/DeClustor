import React, { useState } from 'react'
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
  Typography
} from '@mui/material'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { useTheme } from '@mui/material/styles'

const Setting = () => {
  const [clusters, setClusters] = useState('allClusters')
  const [services, setServices] = useState('allServices')
  const [networkRxBytes, setNetworkRxBytes] = useState(true)
  const [networkTxBytes, setNetworkTxBytes] = useState(true)
  const [cpuUtilization, setCpuUtilization] = useState(true)
  const [memoryUtilization, setMemoryUtilization] = useState(true)
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getTooltipTitle = (isOn) => {
    return isOn ? 'Turn off' : 'Turn on'
  }

  const operators = [
    {
      value: 'greaterThan',
      label: '>',
    },
    {
      value: 'greaterThanOrEqual',
      label: '>=',
    },
    {
      value: 'lessThan',
      label: '<',
    },
    {
      value: 'lessThanOrEqual',
      label: '<=',
    },
    {
      value: 'equal',
      label: '=',
    },
  ]

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
          <FormControl sx={{ mt: 2, minWidth: 180 }}>
            <InputLabel htmlFor="clusters">Clusters</InputLabel>
            <Select
              autoFocus
              value={clusters}
              onChange={(e) => setClusters(e.target.value)}
              label="Clusters"
              inputProps={{
                name: 'clusters',
                id: 'clusters',
              }}
            >
              <MenuItem value="allClusters">All Clusters</MenuItem>
              <MenuItem value="c1">c1</MenuItem>
              <MenuItem value="c2">c2</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: 180 }}>
            <InputLabel htmlFor="services">Services</InputLabel>
            <Select
              autoFocus
              value={services}
              onChange={(e) => setServices(e.target.value)}
              label="Services"
              inputProps={{
                name: 'services',
                id: 'services',
              }}
            >
              <MenuItem value="allServices">All Services</MenuItem>
              <MenuItem value="s1">s1</MenuItem>
              <MenuItem value="s2">s2</MenuItem>
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
            {[
              { id: 'CPUUtilization', label: 'CPUUtilization', value: cpuUtilization, setValue: setCpuUtilization, control: 'CPU utilization monitoring.' },
              { id: 'MemoryUtilization', label: 'MemoryUtilization', value: memoryUtilization, setValue: setMemoryUtilization, control: 'Memory utilization monitoring.' },
              { id: 'NetworkRxBytes', label: 'NetworkRxBytes', value: networkRxBytes, setValue: setNetworkRxBytes, control: 'Network receive bytes monitoring.' },
              { id: 'NetworkTxBytes', label: 'NetworkTxBytes', value: networkTxBytes, setValue: setNetworkTxBytes, control: 'Network transmit bytes monitoring.' }
            ].map((metric) => (
              <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }} key={metric.id}>
                <Grid item xs={4}>
                  <TextField
                    id={metric.id}
                    select
                    label={metric.label}
                    defaultValue="greaterThan"
                    helperText="Please choose an operator"
                    variant="filled"
                    fullWidth
                  >
                    {operators.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    id={`${metric.id}-number`}
                    label="Number"
                    type="number"
                    helperText={`Please enter ${metric.label === 'CPUUtilization' || metric.label === 'MemoryUtilization' ? 'a percentage (%)' : 'a number (Bytes/Second)'}`}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title={getTooltipTitle(metric.value)}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={metric.value}
                          onChange={(e) => metric.setValue(e.target.checked)}
                        />
                      }
                      label="Enable"
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{metric.control}</Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default Setting
