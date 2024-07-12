
// Profile.jsx
import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const Profile = ({ profileData }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    dob: profileData.dob,
    gender: profileData.gender,
    about: profileData.about,
  });

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditedFields({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      dob: profileData.dob,
      gender: profileData.gender,
      about: profileData.about,
    });
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    // Handle save edit logic, e.g., call API to update profile
    console.log('Saving edited profile:', editedFields);
    setEditMode(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedFields({ ...editedFields, [field]: value });
  };
  if (!profileData) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <Paper sx={{ padding: '20px', minHeight: '300px', border: '2px solid #1a237e' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1a237e' }}>
        <Typography variant="h3" sx={{ color: '#1a237e' }}>Profile</Typography>
        {!editMode ? (
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        ) : (
          <>
            <Button onClick={handleSaveEdit} sx={{ marginRight: '10px' }}>Save</Button>
            <Button onClick={handleCancelEdit}>Cancel</Button>
          </>
        )}
      </Box>

      {!editMode ? (
        <>
          <Typography variant="h5" sx={{ marginBottom: '10px' }}>Name: {profileData.firstName} {profileData.lastName}</Typography>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>Email: {profileData.email}</Typography>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>Date of Birth: {profileData.dob}</Typography>
          <Typography variant="body1" sx={{ marginBottom: '10px' }}>Gender: {profileData.gender}</Typography>
          <Typography variant="body1">About: {profileData.about}</Typography>
        </>
      ) : (
        <>
          <TextField
            fullWidth
            label="First Name"
            value={editedFields.firstName}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={editedFields.lastName}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Email"
            value={editedFields.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Date of Birth"
            value={editedFields.dob}
            onChange={(e) => handleFieldChange('dob', e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            label="Gender"
            value={editedFields.gender}
            onChange={(e) => handleFieldChange('gender', e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="About"
            value={editedFields.about}
            onChange={(e) => handleFieldChange('about', e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
        </>
      )}
    </Paper>
  );
};

export default Profile;
