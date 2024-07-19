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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import FlexBetween from '../components/FlexBetween';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { fetchAccounts } from '../redux/userSlice.js';

const drawerWidth = 240;

const Accounts = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userId, rootAccounts, subAccounts, accountsLoading, accountsError } =
    useSelector((state) => state.user);
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [dispatch, userId]);

  const handleAccountClick = (accountName) => {
    navigate(`/dashboard/${accountName}`);
  };

  if (accountsLoading) {
    return <div>Loading...</div>;
  }

  if (accountsError) {
    return <div>Error: {accountsError}</div>;
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
          <Typography variant='h6' gutterBottom>
            Root Accounts
          </Typography>
          <List>
            {rootAccounts.map((account) => (
              <ListItem
                button
                key={account.account_name}
                onClick={() => handleAccountClick(account.account_name)}
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
          <Typography variant='h6' gutterBottom>
            Subaccounts
          </Typography>
          <List>
            {subAccounts.map((account) => (
              <ListItem
                button
                key={account.account_name}
                onClick={() => handleAccountClick(account.account_name)}
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
        }}
      >
        <FlexBetween>
          <Typography variant='h4'>Select an Account from Sidebar</Typography>
        </FlexBetween>
      </Box>
    </Box>
  );
};

export default Accounts;
