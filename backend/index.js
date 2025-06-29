const express = require('express');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const cors = require('cors')

const usuarioRoutes = require('./src/routes/usuario.routes');
const authRoutes = require('./src/routes/auth.routes');
const cursoRoutes = require('./src/routes/cursos.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/cursos', cursoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);

  sequelize.sync().then(() => {
      console.log('Banco sincronizado');
  }).catch(error => console.error('Erro ao subir o banco ' + error))
  
  try {
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
  } catch (error) {
    console.error(error)  
  }


