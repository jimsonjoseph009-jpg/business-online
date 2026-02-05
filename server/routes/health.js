const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Business Online API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
