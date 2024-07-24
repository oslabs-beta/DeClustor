import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';

/**
 * StatusCard component displays the task status and an image.
 * It includes a refresh button to reload the page.
 */
const StatusCard = () => {

    const theme = useTheme();
    const userId = useSelector((state) => state.user.userId);
    const serviceName = useSelector((state) => state.user.serviceName);
    const taskStatus = userId && serviceName && serviceName !== 'service1' ? 'RUNNING' : 'No data found'; // Determine task status based on userId and serviceName

  return (
    <Card sx={{ minWidth:300, maxWidth: 330 , backgroundColor: theme.palette.neutral[300] , color:theme.palette.secondary[700] }}>
      <CardActionArea>
        {/* Display an image */}
        <CardMedia
          component="img"
          height="140"
          image="https://cdn.dribbble.com/users/1008970/screenshots/6140230/blog_post_docker.gif"
          alt="docker container"
        />
        <CardContent>
          {/* Display task status */}
          <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
            Task Status : {taskStatus}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
         {/* Refresh button to reload the page */}
        <Button size="small"  sx={{ color: theme.palette.neutral[700] , backgroundColor: theme.palette.primary[300]}} onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </CardActions>
    </Card>
  );
}
// test to push
export default StatusCard;