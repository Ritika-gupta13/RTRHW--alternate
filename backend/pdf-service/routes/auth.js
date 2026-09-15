const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticates user with email + password and returns JWT token.
 * (Mock authentication for evaluation — no database)
 */
router.post('/login', (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required.'
      });
    }

    // Mock user validation (no database — evaluation prototype)
    const user = {
      name: name || 'Member Evaluator',
      email: email,
      role: 'member'
    };

    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Login: ${user.email}`);

    return res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return res.status(500).json({
      error: true,
      message: 'Authentication service error.'
    });
  }
});

/**
 * POST /api/auth/guest
 * Issues a JWT for guest/supervisor evaluator access (fast-track login).
 */
router.post('/guest', (req, res) => {
  try {
    const user = {
      name: 'Supervisor Evaluator',
      email: 'supervisor@defense.edu',
      role: 'supervisor'
    };

    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Guest login: ${user.email}`);

    return res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Guest login error:', err.message);
    return res.status(500).json({
      error: true,
      message: 'Authentication service error.'
    });
  }
});

/**
 * POST /api/auth/verify
 * Verifies if a JWT token is still valid. Returns decoded user info.
 */
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: true, message: 'Token is required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      valid: true,
      user: {
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    });
  } catch (err) {
    return res.json({ valid: false, message: 'Token is invalid or expired.' });
  }
});

module.exports = router;
