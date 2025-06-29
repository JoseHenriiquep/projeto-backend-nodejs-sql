import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
} from '@mui/material';
import { format, parse } from 'date-fns';

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    nascimento: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // Formatar a data para DD/MM/YYYY
      const formattedData = {
        ...formData,
        nascimento: format(parse(formData.nascimento, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
      };

      await register(formattedData);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Card sx={{ width: '100%', maxWidth: 500 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Registro
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome"
              name="nome"
              autoComplete="name"
              autoFocus
              value={formData.nome}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="senha"
              autoComplete="new-password"
              value={formData.senha}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="nascimento"
              label="Data de Nascimento"
              type="date"
              id="nascimento"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.nascimento}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Registrar
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Já tem uma conta? Faça login
                </Typography>
              </Link>
            </Box>
          </form>
        </Paper>
      </Card>
    </Box>
  );
}

export default Register; 