import React from 'react'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { Link } from 'react-router-dom'

const Alerts = ({ open, notificationCount }) => {
  if (!open) return null

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {notificationCount > 0 ? (
        <Link to="/logs" style={{ textDecoration: 'none' }}>
          <Alert severity="info">You have notifications!</Alert>
        </Link>
      ) : (
        <Alert severity="info">You have no notifications</Alert>
      )}
    </Stack>
  )
}

export default Alerts
