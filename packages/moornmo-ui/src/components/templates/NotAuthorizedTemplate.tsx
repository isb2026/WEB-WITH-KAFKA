import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { useT } from '@repo/i18n';

export const NotAuthorizedTemplate: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h3" gutterBottom>
        UNAUTHORIZED
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
       You are not authorized to access this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        sx={{ px: 4, py: 1 }}
      >
        Go Back
      </Button>
    </Container>
  );
};