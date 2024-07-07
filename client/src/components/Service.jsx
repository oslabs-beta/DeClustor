import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useTheme } from '@emotion/react';
// 
const options = ['Service 1', 'Service 2'];

const Service = () => {
  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState('');
  const theme = useTheme();

  return (
    <div>
      <div>{`Service: ${value !== null ? `'${value}'` : 'Please choose your service name'}`}</div>
      {/* <div>{`Task: '${inputValue}'`}</div> */}
      <br />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        sx={{ minWidth:300, maxWidth: 330 }}
        renderInput={(params) => <TextField {...params} label="Choose your service" />}
      />
      <Card sx={{ minWidth:300, maxWidth: 330 , backgroundColor: theme.palette.neutral[300] , color:theme.palette.secondary[700] }}>
          <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
                  Service Status : ACTIVE
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small"  sx={{ color: theme.palette.neutral[700] , backgroundColor: theme.palette.primary[300]}}>
                Refresh
              </Button>
            </CardActions>
        </Card>

    </div>
  );
}

export default Service;