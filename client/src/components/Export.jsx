import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
//import ShareIcon from '@mui/icons-material/Share';

// props from Logs page
const Export = ({ rows }) => {

  const exportToCSV = () => {
    // declare an empty array
    const csvRows = [];
    // declare a table headers
    const headers = ['Time', 'Cluster', 'Service', 'Metric Name', 'Value', 'Logs'];
    // push the headers into csv array as a string with , join
    csvRows.push(headers.join(','));

    // iterate thru the every rows in csv
    rows.forEach(row => {
      const values = [row.time, row.clusters, row.service, row.metric, row.value, row.logs];
      csvRows.push(values.join(',')); // join the values and push into array
    });

    // create new Blob obj from joined csv strings (data, { type: 'text/plain' });
    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    // create URL for Blob // use createObjectURL() for file downloading
    const csvUrl = URL.createObjectURL(csvData);
    

    // create a href (link) 
    const link = document.createElement('a');
    link.href = csvUrl;

    const date = new Date();
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    link.download = `logs_${dateString}.csv`; // file name and date
    link.click(); // eventListener -> on click
  };

  const actions = [
    // add action exporting function
    { icon: <FileCopyIcon />, name: 'Export', action: exportToCSV },
    // { icon: <ShareIcon />, name: 'Share' },
  ];

  return (

    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {/* mapping all thhe actions */}
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name} 
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action} // 
          />
        ))}
      </SpeedDial>
    </Box>

  );
}

export default Export;
