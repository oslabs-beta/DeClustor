import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const notificationData = [
  {
    timestamp: "2024-07-13T03:53:00.000Z",
    metricName: "NetworkRxBytes",
    value: 20.48,
    threshold: 20,
    operator: ">=",
    serviceName: null
  },
  {
    timestamp: "2024-07-13T03:53:00.000Z",
    metricName: "NetworkTxBytes",
    value: 320.9,
    threshold: 20,
    operator: ">=",
    serviceName: null
  },
  {
    timestamp: "2024-07-13T03:53:00.000Z",
    metricName: "NetworkTxBytes",
    value: 320.9,
    threshold: 20,
    operator: ">=",
    serviceName: null
  },
  {
    timestamp: "2024-07-13T03:53:00.000Z",
    metricName: "NetworkRxBytes",
    value: 20.48,
    threshold: 20,
    operator: ">=",
    serviceName: null
  }
];


const columns = [
  { field: 'time', headerName: 'Time', width: 120 },
  {
    field: 'clusters',
    headerName: 'Cluster',
    width: 170,
    // editable: true,
  },
  {
    field: 'service',
    headerName: 'Service',
    width: 170,
    // editable: true,
  },
  {
    field: 'metric',
    headerName: 'Metric Name',
    width: 170,
    // editable: true,
  },
  {
    field: 'value',
    headerName: 'Value',
    type: 'number',
    width: 110,
    // editable: true,
  },
  {
    field: 'logs',
    headerName: 'Logs',
    // description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 200,
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];
const rows = notificationData.map((data, index) => ({
  id: index + 1,
  time: new Date(data.timestamp).toLocaleTimeString(),
  clusters: data.clusterName || 'no data', // You can replace with actual data if available
  service: data.serviceName || 'no data',
  metric: data.metricName,
  value: data.value,
  logs: data.message || 'no data'
}));

const LogsNotification = () => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
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
      />
    </Box>
  );
}

export default LogsNotification;