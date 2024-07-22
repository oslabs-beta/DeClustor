import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  useTheme,
  IconButton,
  Divider,
  Drawer,
  CssBaseline,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import FlexBetween from '../components/FlexBetween';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {
  fetchAccounts,
  fetchSubAccountDetails,
  selectAccount,
} from '../redux/userSlice.js';
import AccountDetails from '../components/accountDetails';

const drawerWidth = 300;

const Accounts = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    userId,
    rootAccounts = [],
    subAccounts = [],
    accountsLoading,
    accountsError,
    selectedSubAccountDetails = [],
  } = useSelector((state) => state.user);
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [dispatch, userId]);

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

  if (accountsLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (accountsError) {
    return <Typography>Error: {accountsError}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant='persistent'
        anchor='left'
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[200],
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            height: '100%',
            position: 'relative',
          }}
        >
          <Box
            component='img'
            alt='logo'
            src={logo}
            onClick={() => navigate('/dashboard')}
            height='100px'
            width='100px'
            borderRadius='28%'
            sx={{
              objectFit: 'cover',
              borderColor: theme.palette.primary[400],
              borderStyle: 'solid',
              borderWidth: 1,
              cursor: 'pointer',
            }}
          />
          <IconButton
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <CloseIcon />
          </IconButton>
          <Divider sx={{ my: '1rem', width: '100%' }} />
          <Typography variant='h4' gutterBottom>
            Root Accounts
          </Typography>
          <List>
            {rootAccounts.map((account, index) => (
              <ListItem
                button
                key={`root-${account.account_name}-${index}`}
                onClick={() => handleAccountClick(account, 'Root')}
                sx={{ justifyContent: 'center' }}
              >
                <ListItemText
                  primary={account.account_name}
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: '1rem', width: '100%' }} />
          <Typography variant='h4' gutterBottom>
            Subaccounts
          </Typography>
          <List>
            {subAccounts.map((account, index) => (
              <ListItem
                button
                key={`sub-${account.account_name}-${index}`}
                onClick={() => handleAccountClick(account, 'Sub')}
                sx={{ justifyContent: 'center' }}
              >
                <ListItemText
                  primary={account.account_name}
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {!drawerOpen && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            left: 0,
            top: '1rem',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: drawerOpen ? `${drawerWidth}px` : '0px',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <FlexBetween>
          <Typography
            variant='h2'
            sx={{ mb: 2, color: theme.palette.secondary.main }}
          >
            Account Details
          </Typography>
        </FlexBetween>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {selectedSubAccountDetails.map((account, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={`account-${account.account_name}-${index}`}
            >
              <AccountDetails
                account={account}
                accountType='Sub'
                onClick={() => navigate(`/dashboard/${account.account_name}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Accounts;
