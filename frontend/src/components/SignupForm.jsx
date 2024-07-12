import React, { useState } from 'react';
import { TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import axios from 'axios';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Student', // Default role
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: value.trim() ? '' : `${name} is required` });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { firstName, lastName, email, password, role } = formData;
    const newErrors = {};
  
    // Basic validations
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one number, and one special character';
    }
    const validRoles = ['Admin', 'Student', 'Instructor'];
    if (!validRoles.includes(role)) {
      newErrors.role = 'Invalid account type';
    }
  
    // Set errors state with the newErrors object
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        
        const response = await axios.post('http://localhost:5000/api/auth/register', formData);
        // Handle successful registration (e.g., redirect to login)
        console.log('Response:', response.data);
      } catch (error) {
        console.error('Error:', error.message);
        setErrors({ submit: error.message });
      }
    }
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2">Sign Up</Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="firstName"
        label="First Name"
        name="firstName"
        autoComplete="fname"
        autoFocus
        value={formData.firstName}
        onChange={handleChange}
        error={!!errors.firstName}
        helperText={errors.firstName || ''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="lastName"
        label="Last Name"
        name="lastName"
        autoComplete="lname"
        value={formData.lastName}
        onChange={handleChange}
        error={!!errors.lastName}
        helperText={errors.lastName || ''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email || ''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password || ''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="role"
        select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        error={!!errors.role}
        helperText={errors.role || ''}
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="Student">Student</MenuItem>
        <MenuItem value="Instructor">Instructor</MenuItem>
      </TextField>
      {errors.submit && (
        <Typography color="error" variant="body2">
          {errors.submit}
        </Typography>
      )}
      <Button type="submit" fullWidth variant="contained" color="primary">
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupForm;
