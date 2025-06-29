const express = require('express');
const { listarCursos, listarCursosInscritos } = require('../controllers/curso.controller');
const { inscrever, cancelar } = require('../controllers/inscricao.controller');
const tokenVerifyMiddleware = require('../middlewares/tokenVerify.middlware');

const router = express.Router();

router.use(tokenVerifyMiddleware);

router.get('/', listarCursos);
router.get('/:usuarioId', listarCursosInscritos);
router.post('/:cursoId', inscrever);
router.patch('/:cursoId', cancelar);

module.exports = router;