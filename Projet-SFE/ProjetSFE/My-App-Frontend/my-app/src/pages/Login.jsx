import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {  useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Copyright(props) {
  
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        PlanTrack
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const Login=()=> {
  let {loginUser}=useContext(AuthContext)


  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
         m="40px 0 0 0"
         height="75vh"
         sx={{
           marginTop: 18,
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
         }}
        >
          <Avatar sx={{ m: 1,  }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
           Connexion
          </Typography>
          <Box component="form" onSubmit={loginUser} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              type="email"
              label="Adresse e-mail"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'primary' }}
            >
              Connexion
            </Button>
       
          </Box>
       
        <Copyright sx={{ mt: 8, mb: 4 }} /> 
        </Box>
      </Container>
    
  );
}
export default Login