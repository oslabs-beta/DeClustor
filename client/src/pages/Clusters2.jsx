import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  CssBaseline,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClusters } from '../redux/userSlice.js';
import ClusterDetails from '../components/clusterDetails';
import BreadcrumbsNav from '../components/breadcrumbs.jsx';

const Clusters2 = () => {
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

  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    if (userId && accountName) {
      dispatch(fetchClusters({ userId, accountName }))
        .unwrap()
        .then((data) => {
          if (data.clusters.length === 0) {
            navigate('/credentials');
          }
        })
        .catch((error) => {
          console.error('Error fetching clusters:', error);
        });
    }
  }, [dispatch, userId, accountName, navigate]);

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

  const breadcrumbsNav = [
    { name: 'Credentials', path: '/credentials' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'Cluster', path: '/clusters/:accountName' },
    { name: 'Service', path: '/dashboard/:clusterName' },
  ];
  const currentPath = '/clusters/:accountName';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
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
            sx={{ marginTop: '20px' , marginBottom: '20px' }} // Margin bottom for spacing between breadcrumbs and heading
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
            <Typography variant="h3">Cluster Details</Typography>
          </Box>
        </Box>

        {/* Dropdown Menu for Regions */}
        <FormControl variant="outlined" sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel id="region-select-label">Select Region</InputLabel>
          <Select
            labelId="region-select-label"
            id="region-select"
            value={selectedRegion}
            onChange={(e) => handleRegionClick(e.target.value)}
            label="Select Region"
          >
            {clusters.map((regionCluster, index) => (
              <MenuItem key={index} value={regionCluster.region}>
                {regionCluster.region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedRegion ? (
          <Grid container spacing={3}>
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

export default Clusters2;
