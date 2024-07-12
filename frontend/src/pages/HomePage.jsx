import React from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" gutterBottom>Welcome to StudyNexus</Typography>
          <Typography variant="body1" paragraph>
            Empowering Learning, Enhancing Skills
          </Typography>
          <Typography variant="body1" paragraph>
            Explore a wide range of courses, prepare for exams, engage in discussions, and more!
          </Typography>
          <Box mt={4}>
            <Button variant="contained" color="primary" component={Link} to="/courses" style={{ marginRight: '20px' }}>
              Explore Courses
            </Button>
            <Button variant="outlined" color="primary" component={Link} to="/test-series">
              Explore Test series
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h5" gutterBottom>Why Choose Us?</Typography>
          <Typography variant="body1" paragraph>
            - Quality education materials tailored for your needs.
          </Typography> 
          <Typography variant="body1" paragraph>
            - Expert instructors and comprehensive learning resources.
          </Typography>
          <Typography variant="body1" paragraph>
            - Engage with a community of learners and educators.
          </Typography>
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default HomePage;
