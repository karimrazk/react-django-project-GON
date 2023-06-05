import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Container, Box, IconButton } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { styled } from '@mui/material/styles';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function Page404() {
  return (
    <Container>
      <StyledContent>
        <div style={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h2" paragraph>
            Désolé, page introuvable !
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Désolé, nous n'avons pas trouvé la page que vous recherchez. Peut-être avez-vous mal saisi l'URL ? Assurez-vous de vérifier votre orthographe.
          </Typography>

          <Box
            component="img"
            src="./../images/NotFound0.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button size="large" variant="contained" component={RouterLink} to="/">
            <IconButton aria-label="Go to Home">
              <KeyboardReturnIcon />
            </IconButton>
            Accueil
          </Button>
        </div>
      </StyledContent>
    </Container>
  );
}
