import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';

const Feedback = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <Button
        variant='contained'
        color='secondary'
        onClick={toggleDrawer(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
        startIcon={<FeedbackIcon />}
      >
        Give Feedback
      </Button>
      <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h6'>Feedback</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label='Your Feedback'
              multiline
              rows={4}
              variant='outlined'
              required
              sx={{ mb: 2 }}
            />
            <Button type='submit' variant='contained' color='primary' fullWidth>
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Feedback;
