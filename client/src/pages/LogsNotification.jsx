import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import connectWebSocketToNotification from '../webService/connectWebSocketToNotification';
import { useSelector } from 'react-redux';

const columns = [
  { field: 'time', headerName: 'Time', flex: 1 },
  { field: 'clusters', headerName: 'Cluster', flex: 1 },
  { field: 'service', headerName: 'Service', flex: 1 },
  { field: 'metric', headerName: 'Metric Name', flex: 1 },
  { field: 'value', headerName: 'Value', type: 'number', flex: 1 },
  { field: 'logs', headerName: 'Logs', sortable: false, flex: 4 },
];

const LogsNotification = () => {
  connectWebSocketToNotification();
  const receivedNotifications = useSelector((state) => state.notification.receivedNotifications);
  const rows = receivedNotifications.map((data, index) => ({
    id: index + 1,
    time: new Date(data.timestamp).toLocaleTimeString(),
    clusters: data.clusterName || 'no data',
    service: data.serviceName || 'no data',
    metric: data.metricName,
    value: data.value,
    logs: data.Logs || 'no data',
  }));

  return (
    <Box sx={{ height: 400, width: '100%', pr: 4 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
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
  );
};

export default LogsNotification;
