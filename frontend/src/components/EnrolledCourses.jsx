// EnrolledCourses.jsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const EnrolledCourses = () => {
  return (
    <Paper sx={{ padding: '20px', minHeight: '300px', border: '2px solid #1a237e' }}>
      <Typography variant="h3" sx={{ color: '#1a237e' }}>Enrolled Courses</Typography>
      {/* Add content for enrolled courses */}
    </Paper>
  );
};

export default EnrolledCourses;
