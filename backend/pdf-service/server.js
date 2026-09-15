const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ──────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://r-t-r-h-w.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));

// ─── ROUTES ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);

// ─── HEALTH CHECK ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'varshametric-pdf-service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.message);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

// ─── START SERVER ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔════════════════════════════════════════════════╗');
  console.log('  ║   SAVJAL Varshametric PDF Service             ║');
  console.log(`  ║   Running on http://localhost:${PORT}             ║`);
  console.log('  ║   JWT Auth + Municipal PDF Generator          ║');
  console.log('  ╚════════════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
