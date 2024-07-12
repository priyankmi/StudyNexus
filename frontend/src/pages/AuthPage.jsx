import React, { useState } from 'react';
import { Container, Paper, Grid, Button, createTheme, ThemeProvider } from '@mui/material';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

// Define a custom theme with a bluish black button color
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Adjusted to a bluish black color
    },
  },
});

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginClick = () => {
    setIsLogin(true);
  };

  const handleSignupClick = () => {
    setIsLogin(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} textAlign="center" marginBottom="20px">
              <Button
                variant={isLogin ? 'contained' : 'outlined'}
                color="primary" // Changed color to primary
                size="large" // Increased button size
                onClick={handleLoginClick}
                style={{ marginRight: '10px' }} // Added margin for spacing
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? 'contained' : 'outlined'}
                color="primary" // Changed color to primary
                size="large" // Increased button size
                onClick={handleSignupClick}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={12}>
              {isLogin ? <LoginForm /> : <SignupForm />}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AuthenticationPage;
