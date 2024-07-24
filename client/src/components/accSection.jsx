import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Box,
  ListItemIcon,
  Tooltip,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAccounts,
  fetchSubAccountDetails,
  selectAccount,
} from '../redux/userSlice';

const AccountsSection = ({ userId }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootAccounts = useSelector((state) => state.user.rootAccounts) || [];
  const subAccounts = useSelector((state) => state.user.subAccounts) || [];
  const theme = useTheme();
  const textColor = theme.palette.secondary[100]; // Match color with Sidebar titles

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId));
    }
  }, [dispatch, userId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAccountClick = (account, accountType) => {
    if (account) {
      dispatch(selectAccount({ account, accountType }));
      if (accountType === 'Root') {
        dispatch(
          fetchSubAccountDetails({ userId, accountName: account.account_name })
        );
        navigate('/accounts');
      }
    }
  };

  const handleAddAccountClick = () => {
    navigate('/credentials');
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      mt={2}
      width='100%'
      sx={{ backgroundColor: 'transparent' }}
    >
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        sx={{ backgroundColor: 'transparent', boxShadow: 'none', width: '100%' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: textColor }} />}
          aria-controls='panel1d-content'
          id='panel1d-header'
        >
          <Box display='flex' alignItems='center' justifyContent='center' width='100%'>
            <ManageAccountsIcon sx={{ color:'#03a9f4' , mr: 1 }} />
            <Typography sx={{ color: '#4fc3f7', textAlign: 'center' }}>
              Account Management
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box display='flex' flexDirection='column' alignItems='center'>
            {rootAccounts.length > 0 && (
              <Box mb={2} width='100%'>
                <Typography
                  sx={{ color: theme.palette.secondary[400], fontWeight: 'bold', mb: 1, textAlign: 'center' }}
                >
                  Root Accounts
                </Typography>
                <List sx={{ textAlign: 'center' }}>
                  {rootAccounts.map((account) => (
                    <ListItem
                      key={account.id}
                      onClick={() => handleAccountClick(account, 'Root')}
                      sx={{
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          width: '100%',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <AccountBalanceIcon sx={{ color: textColor }} />
                      </ListItemIcon>
                      <ListItemText primary={account.account_name} sx={{ color: textColor }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {subAccounts.length > 0 && (
              <Box width='100%'>
                <Typography
                  sx={{ color: textColor, fontWeight: 'bold', mb: 1, textAlign: 'center' }}
                >
                  Sub Accounts
                </Typography>
                <List sx={{ textAlign: 'center' }}>
                  {subAccounts.map((account) => (
                    <ListItem
                      key={account.id}
                      onClick={() => handleAccountClick(account, 'Sub')}
                      sx={{
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          width: '100%',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <SupervisorAccountIcon sx={{ color: textColor }} />
                      </ListItemIcon>
                      <ListItemText primary={account.account_name} sx={{ color: textColor }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {rootAccounts.length === 0 && subAccounts.length === 0 && (
              <Typography sx={{ color: textColor }}>No accounts available</Typography>
            )}
          </Box>
          <Box display='flex' justifyContent='flex-end' width='100%' mt={2}>
            <Tooltip title='Add more accounts'>
              <IconButton
                onClick={handleAddAccountClick}
                sx={{ color:'#03a9f4' }}
              >
                <GroupAddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccountsSection;
