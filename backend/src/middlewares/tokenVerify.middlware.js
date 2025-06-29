const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ msg: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token inválido ou expirado' });
  }
}

module.exports = verifyToken;