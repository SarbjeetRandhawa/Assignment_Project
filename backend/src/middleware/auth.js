// JWT auth middleware — protect routes by sending header: Authorization: Bearer <token>
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

module.exports = function(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No Authorization header' });

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid Authorization format' });
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload; // attach admin info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
