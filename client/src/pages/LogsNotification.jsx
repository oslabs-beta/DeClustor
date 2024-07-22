import React, { useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import connectWebSocketNotifications from '../webService/connectWebSocketToNotifications'
import { useSelector, useDispatch } from 'react-redux'
import {
  markNotificationsAsRead,
  clearNotificationBadge,
  setReceivedNotifications,
} from '../redux/notificationSlice'
import Export from '../components/Export.jsx'

// set the column fields for the table formatting
const columns = [
  { field: 'time', headerName: 'Time', flex: 1 },
  { field: 'clusters', headerName: 'Cluster', flex: 1 },
  { field: 'service', headerName: 'Service', flex: 1 },
  { field: 'metric', headerName: 'Metric Name', flex: 1 },
  { field: 'value', headerName: 'Value', type: 'number', flex: 1 },
  { field: 'logs', headerName: 'Logs', sortable: false, flex: 4 },
]

const LogsNotification = () => {
  // connect to webSocket
  connectWebSocketNotifications()
  const dispatch = useDispatch()
  // array of {} of the notications
  const receivedNotifications = useSelector(
    (state) => state.notification.receivedNotifications
  )

  // redux mark as read // clear badge
  useEffect(() => {
    const markAndClearNotifications = () => {
      const updatedNotifications = receivedNotifications.map(
        (notification) => ({
          ...notification,
          isRead: true,
        })
      )
      dispatch(setReceivedNotifications(updatedNotifications))
      dispatch(markNotificationsAsRead())
      dispatch(clearNotificationBadge())
    }

    if (receivedNotifications.some((notification) => !notification.isRead)) {
      markAndClearNotifications()
    }
  }, [dispatch, receivedNotifications])

  // check after the notification button has clicked
  useEffect(() => {
    console.log('Received notifications changed -->', receivedNotifications)
  }, [receivedNotifications])
  
  const rows = useMemo(
    () =>
      (receivedNotifications || []).map((data, index) => {
        if (data && data.timestamp) {
          return {
            id: index + 1,
            time: new Date(data.timestamp).toLocaleTimeString(),
            clusters: data.clusterName || 'N/A',
            service: data.serviceName || 'not applicable',
            metric: data.metricName || 'N/A',
            value: data.value || 0,
            logs: data.Logs || 'N/A',
          }
        } else {
          return {
            id: index + 1,
            time: 'Invalid Data',
            clusters: 'Invalid Data',
            service: 'Invalid Data',
            metric: 'Invalid Data',
            value: 'Invalid Data',
            logs: 'Invalid Data',
          }
        }
      }),
    [receivedNotifications]
  )

  return (
    <div>
      <Box sx={{ height: 700, width: '100%', pr: 4 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            },
            '& .MuiDataGrid-columnHeaders': {
              textAlign: 'center',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        />
      </Box>
      {/* rows props*/}
      <Export rows={rows} />
    </div>
  )
}

export default LogsNotification;
