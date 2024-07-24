import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, useTheme, Grid, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  fetchAccounts,
  fetchSubAccountDetails,
  selectAccount,
} from '../redux/userSlice.js'
import AccountDetails from '../components/accountDetails.jsx'
import BreadcrumbsNav from '../components/breadcrumbs.jsx'

const Accounts = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    userId,
    rootAccounts = [],
    subAccounts = [],
    accountsLoading,
    accountsError,
    selectedSubAccountDetails = [],
  } = useSelector((state) => state.user)

  useEffect(() => {
    if (userId) {
      dispatch(fetchAccounts(userId))
    }
  }, [dispatch, userId])

  const handleAccountClick = (account, accountType) => {
    if (account) {
      dispatch(selectAccount({ account, accountType }))
      if (accountType === 'Root') {
        dispatch(
          fetchSubAccountDetails({ userId, accountName: account.account_name })
        )
      }
    }
  }

  if (accountsLoading) {
    return <Typography>Loading...</Typography>
  }

  if (accountsError) {
    return <Typography>Error: {accountsError}</Typography>
  }

  const breadcrumbsNav = [
    { name: 'Credentials', path: '/credentials' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'Cluster', path: '/clusters/:accountName' },
    { name: 'Service', path: '/dashboard/:clusterName' },
  ]
  const currentPath = '/clusters/accounts'

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            mb: 4,
          }}
        >
          <BreadcrumbsNav
            breadcrumbs={breadcrumbsNav}
            currentPath={currentPath}
            sx={{ marginTop: '20px', marginBottom: '20px' }}
          />
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.secondary[300],
              borderRadius: 1,
              mb: 3,
              color: theme.palette.primary[700],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: '10px',
            }}
          >
            <Typography variant="h3">Account Details</Typography>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {selectedSubAccountDetails.map((account, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={`account-${account.account_name}-${index}`}
            >
              <Paper
                elevation={3}
                sx={{
                  borderRadius: '15px',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  marginLeft: '20px',
                }}
              >
                <AccountDetails
                  account={account}
                  accountType="Sub"
                  onClick={() => navigate(`/dashboard/${account.account_name}`)}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Accounts
