import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/cursos', {
        params: searchTerm.trim() ? { filtro: searchTerm } : undefined,
      });
      setCourses(response.data);
    } catch (err) {
      setError('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCourses();
  }, [user, navigate, fetchCourses]);

  const handleSubscribe = async (courseId) => {
    try {
      await axios.post(`/cursos/${courseId}`);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao se inscrever no curso');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Se o campo estiver vazio, busca imediatamente
    if (!value.trim()) {
      fetchCourses();
    }
  };

  return (
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 4
      }}>
        <TextField
          label="Buscar cursos"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            width: { xs: '100%', sm: '80%', md: '60%' },
            maxWidth: 800
          }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ flex: 1 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ 
              width: 300,
              height: 400,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardMedia
                component="img"
                height="160"
                image={course.capa}
                alt={course.nome}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 2
              }}>
                <Box>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {course.nome}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      height: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1
                    }}
                  >
                    {course.descricao}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inscrições: {course.inscricoes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Início: {course.inicio}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleSubscribe(course.id)}
                  disabled={course.inscrito}
                >
                  {course.inscrito ? 'Inscrito' : 'Inscrever-se'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Courses; 