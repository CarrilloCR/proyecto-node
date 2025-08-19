const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = req.query.token || (authHeader && authHeader.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRETO_SUPER_SEGUR0');
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
module.exports = { verificarToken };
