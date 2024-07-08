import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useTheme } from '@emotion/react';


const StatusCard = () => {

    const theme = useTheme();

  return (
    <Card sx={{ minWidth:300, maxWidth: 330 , backgroundColor: theme.palette.neutral[300] , color:theme.palette.secondary[700] }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="https://cdn.dribbble.com/users/1008970/screenshots/6140230/blog_post_docker.gif"
          alt="docker container"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" fontWeight="bold">
            Task Status : RUNNING
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small"  sx={{ color: theme.palette.neutral[700] , backgroundColor: theme.palette.primary[300]}}>
          Refresh
        </Button>
      </CardActions>
    </Card>
  );
}

export default StatusCard;