import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100vw',
            overflowX: 'hidden',
            bgcolor: 'background.default'
          }}>
            <Navigation />
            <Box component="main" sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              py: 3
            }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cursos" element={<Courses />} />
                <Route path="/:usuarioId" element={<MyCourses />} />
                <Route path="/" element={<Navigate to="/cursos" replace />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
