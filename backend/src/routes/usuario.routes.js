const express = require('express');
const { cadastrar, listar } = require('../controllers/usuario.controller');

const router = express.Router();

router.post('/', cadastrar);
router.get('/', listar);

module.exports = router;