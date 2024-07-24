import React from 'react'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
// import redux on mark and clear
import { markNotificationsAsRead, clearNotificationBadge } from '../redux/notificationSlice'

const Alerts = ({ notificationCount, onAlertClick }) => {

  const dispatch = useDispatch()

  // handle cleaning and counting notification
  const handleAlertClick = () => {
    // first time clicking
    dispatch(markNotificationsAsRead())
    // then clear the number on the badge
    dispatch(clearNotificationBadge())
    onAlertClick()
  }

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {notificationCount > 0 ? (
        <Link
          to="/logs"
          style={{ textDecoration: 'none' }}
          onClick={handleAlertClick}
        >
          <Alert severity="info">You have notifications!</Alert>
        </Link>
      ) : (
        <Alert severity="info">You have no notifications</Alert>
      )}
    </Stack>
  )
}

export default Alerts
