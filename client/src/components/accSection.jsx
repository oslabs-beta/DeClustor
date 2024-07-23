import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccount, fetchSubAccountDetails } from '../redux/userSlice';

const AccountsSection = ({ userId }) => {
  const dispatch = useDispatch();
  const rootAccounts = useSelector((state) => state.user.rootAccounts);
  const subAccounts = useSelector((state) => state.user.subAccounts);

  const handleAccountClick = (account, accountType) => {
    if (account) {
      dispatch(selectAccount({ account, accountType }));
      if (accountType === 'Root') {
        dispatch(
          fetchSubAccountDetails({ userId, accountName: account.account_name })
        );
      }
    }
  };

  return (
    <div>
      <Typography variant='h6' sx={{ m: '1rem 0 0.5rem 1rem' }}>
        Root Accounts
      </Typography>
      <List>
        {rootAccounts.map((account, index) => (
          <ListItem
            button
            key={`root-${account.account_name}-${index}`}
            onClick={() => handleAccountClick(account, 'Root')}
          >
            <ListItemText primary={account.account_name} />
          </ListItem>
        ))}
      </List>
      <Typography variant='h6' sx={{ m: '1rem 0 0.5rem 1rem' }}>
        Sub Accounts
      </Typography>
      <List>
        {subAccounts.map((account, index) => (
          <ListItem
            button
            key={`sub-${account.account_name}-${index}`}
            onClick={() => handleAccountClick(account, 'Sub')}
          >
            <ListItemText primary={account.account_name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AccountsSection;
