import React, { useState } from 'react';
import { Container, Paper, Grid } from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import FormToggle from './FormToggle';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormToggle isLogin={isLogin} toggleForm={toggleForm} />
          </Grid>
          <Grid item xs={12}>
            {isLogin ? <LoginForm /> : <SignupForm />}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AuthForm;
