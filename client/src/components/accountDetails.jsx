import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

const AccountDetails = () => {
  const selectedAccount = useSelector((state) => state.user.selectedAccount);
  const selectedAccountType = useSelector(
    (state) => state.user.selectedAccountType
  );

  if (!selectedAccount) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant='h5'>No Account Selected</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5'>Account Details</Typography>
      <Typography>
        <strong>Account Type:</strong> {selectedAccountType}
      </Typography>
      <Typography>
        <strong>Account Name:</strong> {selectedAccount.accountName}
      </Typography>
      <Typography>
        <strong>Status:</strong> {selectedAccount.status}
      </Typography>
      <Typography>
        <strong>Email:</strong> {selectedAccount.email}
      </Typography>
      <Typography>
        <strong>User ID:</strong> {selectedAccount.userId}
      </Typography>
    </Box>
  );
};

export default AccountDetails;
