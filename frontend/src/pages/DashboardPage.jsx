// DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Grid, Box } from '@mui/material';
import Profile from '../components/Profile';
import EnrolledCourses from '../components/EnrolledCourses';
import EnrolledTestSeries from '../components/EnrolledTestSeries';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  const [selectedOption, setSelectedOption] = useState('profile');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/getProfile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (selectedOption === 'profile') {
      fetchProfile();
    }
  }, [selectedOption]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case 'profile':
        return <Profile profileData={profileData} />;
      case 'enrolledCourses':
        return <EnrolledCourses />;
      case 'enrolledTestSeries':
        return <EnrolledTestSeries />;
      case 'logout':
        // Implement logout logic or redirect to logout page
        return <div>Logout Logic</div>;
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Sidebar */}
      <Grid item xs={3}>
        <Sidebar selectedOption={selectedOption} handleOptionSelect={handleOptionSelect} />
      </Grid>

      {/* Content */}
      <Grid item xs={9}>
        <Box sx={{ padding: '20px' }}>
        
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
