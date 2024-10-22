import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Alert,
  TextField,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { updateProfile } from '../redux/userSlice'
import EditIcon from '@mui/icons-material/Edit'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import CancelIcon from '@mui/icons-material/Cancel'
import Navbar from '../components/Navbar'
import { useTheme } from '@emotion/react'

// UserProfile component
const UserProfile = () => {
  // Get user data from Redux store
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  // State for the username and password input field
  const [username, setNewUsername] = useState(user.username || '')
  const [email, setNewEmail] = useState(user.email || '')
  // State to track if the user is in edit mode
  const [isEditing, setIsEditing] = useState(false)
  // State to track any error and success
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const theme = useTheme()
  const navigate = useNavigate()

  // UseEffect to update the input fields when the user data changes
  useEffect(() => {
    setNewUsername(user.username || '')
    setNewEmail(user.email || '')
  }, [user])

  // handle edit button
  const handleEditButton = () => {
    // set isEditing to be true
    setIsEditing(true)
    // set Error
    setError(null)
    // set success
    setSuccess(null)
  }

  // save button function // onClick={saveChangeBtn}
  // after click it alert 'password has been changed'
  const saveChangeBtn = async () => {
    if (!username || !email) {
      setError('Username and Password are required.')
      return
    }

    try {
      dispatch(updateProfile({ username, email }))
      const response = await fetch(
        'http://localhost:3000/reset-email-username',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.userId, username, email }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update profile.')
      }
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      setError('Failed to updat profile.')
    }
  }

  // cancel btn function
  //onClick={cancelBtn}
  const cancelBtn = () => {
    setNewUsername(user.username || '')
    setNewEmail(user.email || '')
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }

  return (
    <div>
      {/* Navbar component */}
      <Navbar showSidebar={false} showSearch={false} />
      <Container maxWidth="small">
        {/* Form container */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          {/* set onSubmit form function handleSubmit */}
          <Box
            component="form"
            sx={{
              mt: 1,
              width: '80%',
              maxWidth: '600px',
              padding: 3,
              border: '1px solid #ccc',
              borderRadius: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* <Typography component='h1' variant='h2' fontWeight='bold'>
          User Profile
        </Typography> */}
            <Box
              component="img"
              alt="mock profile"
              src={
                'https://t4.ftcdn.net/jpg/01/06/92/47/360_F_106924759_7qPPu6bZNN2O4al1ExdEWBdHUcpKMwuJ.jpg'
              }
              height="100px"
              width="100px"
              borderRadius="50%"
              sx={{ objectFit: 'cover' }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
                {success}
              </Alert>
            )}
            <Typography
              component={Link}
              to="/credentials"
              sx={{ color: theme.palette.secondary[100] }}
            >
              Credentials
            </Typography>
            {/* first name // unable to change */}
            <TextField
              variant="outlined"
              label="First Name"
              value={user.firstName || ''}
              disabled
              fullWidth
            />
            {/* last name // unable to change */}
            <TextField
              variant="outlined"
              label="Last Name"
              value={user.lastName || ''}
              disabled
              fullWidth
            />

            {/* username // setnewUsername */}
            <TextField
              variant="outlined"
              label="Username"
              value={username || ''}
              onChange={(e) => setNewUsername(e.target.value)}
              fullWidth
              disabled={!isEditing}
              sx={{
                backgroundColor: isEditing
                  ? theme.palette.action.selected
                  : 'inherit',
              }}
            />

            {/* email // setNewEmail */}
            <TextField
              variant="outlined"
              label="email"
              type="email"
              value={email || ''}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
              disabled={!isEditing}
              sx={{
                backgroundColor: isEditing
                  ? theme.palette.action.selected
                  : 'inherit',
              }}
            />

            {/* if editing mode */}
            {isEditing ? (
              // if it's in editng mode
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Tooltip title="Save">
                  <IconButton
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={saveChangeBtn}
                  >
                    {/* Save button */}
                    <TaskAltIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Cancel">
                  <IconButton color="error" sx={{ mt: 2 }} onClick={cancelBtn}>
                    {/* cancel button */}
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              // if not in editing
              <Tooltip title="Edit">
                <IconButton
                  color="secondary"
                  sx={{ mt: 2 }}
                  onClick={handleEditButton}
                >
                  {/* edit button */}
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/dashboard')}
              sx={{ padding: 1.5 }}
            >
              Back to Home Page
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default UserProfile
