import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AccountDetails = ({ account, accountType }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    if (account && account.Name) {
      navigate(`/clusters/${account.Name}`);
    } else {
      console.error('Account or account name is missing');
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: theme.palette.background.alt,
        color: theme.palette.neutral.main,
        boxShadow: theme.shadows[5],
        '&:hover': {
          boxShadow: theme.shadows[10],
        },
        borderRadius: '16px',
        width: '350px',
        height: 'auto',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <CardActionArea>
        <CardContent sx={{ padding: '25px' }}>
          <Typography
            variant='h4'
            component='div'
            sx={{ mb: 2, color: theme.palette.secondary.main }}
          >
            {account.Name}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`ID: ${account.Id}`}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`Email: ${account.Email}`}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {`Status: ${account.Status}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AccountDetails;
