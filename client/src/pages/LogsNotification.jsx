import React, { useEffect, useState, useCallback  } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import useWebSocketNotifications from '../webService/useWebSocketNotifications';
import { useSelector, useDispatch } from 'react-redux';

const columns = [
  { field: 'time', headerName: 'Time', flex: 1 },
  { field: 'clusters', headerName: 'Cluster', flex: 1 },
  { field: 'service', headerName: 'Service', flex: 1 },
  { field: 'metric', headerName: 'Metric Name', flex: 1 },
  { field: 'value', headerName: 'Value', type: 'number', flex: 1 },
  { field: 'logs', headerName: 'Logs', sortable: false, flex: 4 },
];

const LogsNotification = () => {
  useWebSocketNotifications(webSocketKey);
  const [webSocketKey, setWebSocketKey] = useState(0);
  useEffect(() => {
    setWebSocketKey((prevKey) => prevKey + 1);
  }, []);
  

  const receivedNotifications = useSelector((state) => state.notification.receivedNotifications);
  
  const rows = receivedNotifications
    .map((data, index) => ({
    id: index + 1,
    time: new Date(data.timestamp).toLocaleTimeString(),
    clusters: data.clusterName,
    service: data.serviceName || 'not applicable',
    metric: data.metricName,
    value: data.value,
    logs: data.Logs,
  }));


  return (
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
  );
};

export default LogsNotification;
