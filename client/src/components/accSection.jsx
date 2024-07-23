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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  return (
    <Box display='flex' flexDirection='column' alignItems='center' mt={2}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1d-content'
          id='panel1d-header'
        >
          <Typography sx={{ color: textColor }}>Account Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display='flex' flexDirection='column' alignItems='center'>
            {rootAccounts.length > 0 && (
              <Box>
                <Typography
                  sx={{ color: textColor, fontWeight: 'bold', mb: 1 }}
                >
                  Root Accounts
                </Typography>
                <List sx={{ textAlign: 'center' }}>
                  {rootAccounts.map((account) => (
                    <ListItem
                      button
                      key={account.id}
                      onClick={() => handleAccountClick(account, 'Root')}
                      sx={{ justifyContent: 'center' }}
                    >
                      <ListItemText primary={account.account_name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {subAccounts.length > 0 && (
              <Box mt={2}>
                <Typography
                  sx={{ color: textColor, fontWeight: 'bold', mb: 1 }}
                >
                  Sub Accounts
                </Typography>
                <List sx={{ textAlign: 'center' }}>
                  {subAccounts.map((account) => (
                    <ListItem
                      button
                      key={account.id}
                      onClick={() => handleAccountClick(account, 'Sub')}
                      sx={{ justifyContent: 'center' }}
                    >
                      <ListItemText primary={account.account_name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {rootAccounts.length === 0 && subAccounts.length === 0 && (
              <Typography>No accounts available</Typography>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccountsSection;
