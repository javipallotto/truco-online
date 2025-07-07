const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Inyectamos ID y username del token al request
    req.userId = decoded.id;
    req.username = decoded.username;

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};
