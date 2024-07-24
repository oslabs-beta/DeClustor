import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  useTheme,
  Box,
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
        width: '100%',
        height: 'auto',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
        border: 'none',
      }}
    >
      <CardActionArea>
        <CardContent sx={{ padding: '25px' }}>
          <Typography
            variant='h4'
            component='div'
            sx={{ mb: 2, color: theme.palette.secondary.main }}
          >
            {account.Name || 'No account name'}
          </Typography>
          <Box component="table" sx={{ width: '100%', tableLayout: 'fixed' }}>
            <Box component="tbody">
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  ID:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {account.Id || 'N/A'}
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  Email:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {account.Email || 'N/A'}
                </Box>
              </Box>
              <Box component="tr">
                <Box component="td" sx={{ fontWeight: 'bold', paddingRight: '8px', fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  Status:
                </Box>
                <Box component="td" sx={{ fontSize: '1.1rem', color: theme.palette.secondary[100] }}>
                  {account.Status || 'N/A'}
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default AccountDetails;
