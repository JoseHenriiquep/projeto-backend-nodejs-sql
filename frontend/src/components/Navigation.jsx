import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMyCourses = () => {
    if (user && user.id) {
      navigate(`/${user.id}`);
    }
  };

  return (
    <AppBar position="static" sx={{ width: '100%' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Plataforma de Cursos
        </Typography>
        {user ? (
          <>
            <Button color="inherit" onClick={() => navigate('/cursos')}>
              Cursos
            </Button>
            <Button color="inherit" onClick={handleMyCourses}>
              Meus Cursos
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Sair
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Cadastrar
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation; 