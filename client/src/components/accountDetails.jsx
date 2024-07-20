import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const AccountDetails = ({ account, accountType, onClick }) => {
  if (!account) {
    return null;
  }

  const { account_name, status, email, userId } = account;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{ cursor: 'pointer' }}
        onClick={() => onClick(account, accountType)}
      >
        <CardContent>
          <Typography variant='h6'>{account_name || 'N/A'}</Typography>
          <Typography variant='body2'>Type: {accountType}</Typography>
          <Typography variant='body2'>Status: {status || 'N/A'}</Typography>
          <Typography variant='body2'>Email: {email || 'N/A'}</Typography>
          <Typography variant='body2'>User ID: {userId || 'N/A'}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AccountDetails;
