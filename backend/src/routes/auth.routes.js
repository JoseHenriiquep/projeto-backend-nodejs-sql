const express = require('express');
const { login } = require('../controllers/usuario.controller');

const router = express.Router();

router.post('/login', login);

module.exports = router;