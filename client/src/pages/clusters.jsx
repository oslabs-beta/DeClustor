import React, { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import FlexBetween from '../components/FlexBetween';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { fetchClusters } from '../redux/userSlice.js';
import ClusterDetails from '../components/clusterDetails';

const drawerWidth = 300;

const Clusters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { accountName } = useParams();
  const {
    userId,
    clusters = [],
    clustersLoading = false,
    clustersError = '',
  } = useSelector((state) => state.user);

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    if (userId && accountName) {
      dispatch(fetchClusters({ userId, accountName }))
        .unwrap()
        .then((data) => {
          // Redirect if no clusters are available
          if (data.clusters.length === 0) {
            navigate('/credentials');
          }
        })
        .catch((error) => {
          console.error('Error fetching clusters:', error);
        });
    }
  }, [dispatch, userId, accountName, navigate]);

  // redirect users back to credentials if there are no clusters for that acc
  useEffect(() => {
    if (clusters.length === 0) {
      navigate('/credentials');
    }
  }, [clusters, navigate]);

  if (clustersLoading) {
    return <Typography>Loading clusters...</Typography>;
  }

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };

  const regionClusters = clusters.find(
    (regionCluster) => regionCluster.region === selectedRegion
  );

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
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
            <Typography variant='h4' gutterBottom>
              Regions
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {clusters.map((regionCluster, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleRegionClick(regionCluster.region)}
                >
                  <ListItemText primary={regionCluster.region} />
                </ListItem>
              ))}
            </List>
          </Box>
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
            Cluster Details
          </Typography>
        </FlexBetween>
        {selectedRegion ? (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {regionClusters?.clusters.map((cluster, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`cluster-${cluster.clusterName}-${index}`}
              >
                <ClusterDetails cluster={cluster} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Select a region to view clusters.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Clusters;
