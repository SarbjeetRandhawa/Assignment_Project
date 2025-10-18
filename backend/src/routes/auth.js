// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// -------------------------
// Admin Signup
// POST /api/auth/signup
// -------------------------
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Admin with that email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, passwordHash });

    res.status(201).json({
      id: admin._id,
      email: admin.email
    });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ error: 'Server error on signup' });
  }
});

// -------------------------
// Admin Login
// POST /api/auth/login
// -------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ sub: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Server error on login' });
  }
});

// -------------------------
// JWT Verification Middleware
// -------------------------
function verifyToken(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  try {
    // Expecting "Bearer <token>"
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// -------------------------
// Sample Admin-Only Route
// GET /api/auth/admin-only
// -------------------------
router.get('/admin-only', verifyToken, (req, res) => {
  res.json({ msg: `Hello Admin ${req.admin.email}, you accessed a protected route!` });
});

module.exports = router;
