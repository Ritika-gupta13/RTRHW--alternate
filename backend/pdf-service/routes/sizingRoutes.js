const express = require('express');
const router = express.Router();
const sizingController = require('../controllers/sizingController');

// Deliverable Endpoint: POST /api/v1/sizing/calculate
router.post('/calculate', sizingController.calculateSizing);

module.exports = router;