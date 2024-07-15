import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom'
import LogsNotification from '../pages/LogsNotification';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
// import Badge from '@mui/material/Badge'
// import { Box, IconButton, InputBase, Typography, Tooltip } from '@mui/material'

const Alerts = ({ open }) => {

    if (!open) return null;

  return (

    <Stack sx={{ width: '100%' }} spacing={2}>
      {/* <Alert severity="success">This is a success Alert.</Alert> */}
      <Link to="/logs" style={{ textDecoration: 'none' }}>
      <Alert severity="info">You have notifications!</Alert>
      </Link>
      {/* <Alert severity="warning">This is a warning Alert.</Alert> */}
      {/* <Alert severity="error">This is an error Alert.</Alert> */}
    </Stack>
  );
}

export default Alerts;