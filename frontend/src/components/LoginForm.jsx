import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: value.trim() ? '' : `${name} is required` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    const newErrors = {};

    // Basic validations
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';

    // Set errors state with the newErrors object
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', formData);
        // Handle successful login (e.g., redirect to dashboard)
        localStorage.setItem('token', response.data.token);

      } catch (error) {
        console.error('Error:', error.message);
        setErrors({ submit: error.message });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2">Login</Typography>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
        onKeyPress={handleKeyPress} // Trigger handleSubmit on Enter
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
        onKeyPress={handleKeyPress} // Trigger handleSubmit on Enter
        error={!!errors.password}
        helperText={errors.password || ''}
      />
      {errors.submit && (
        <Typography color="error" variant="body2">
          {errors.submit}
        </Typography>
      )}
      <Button type="submit" fullWidth variant="contained" color="primary">
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
