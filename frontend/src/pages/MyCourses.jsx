import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Box,
  Alert,
  Chip,
} from '@mui/material';

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { usuarioId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.id !== parseInt(usuarioId)) {
      navigate('/cursos');
      return;
    }

    fetchMyCourses();
  }, [user, usuarioId, navigate]);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/cursos/${usuarioId}`);
      setCourses(response.data);
    } catch (err) {
      setError('Erro ao carregar cursos inscritos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (courseId) => {
    try {
      await axios.patch(`/cursos/${courseId}`);
      fetchMyCourses();
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao cancelar inscrição');
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
      <Typography variant="h4" component="h1" gutterBottom>
        Meus Cursos
      </Typography>
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
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={course.inscricao_cancelada ? 'Inscrição Cancelada' : 'Inscrito'}
                      color={course.inscricao_cancelada ? 'error' : 'success'}
                    />
                    {!course.inscricao_cancelada && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelSubscription(course.id)}
                      >
                        Cancelar Inscrição
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MyCourses; 