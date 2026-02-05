const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { mockProducts, mockCustomers, mockOrders } = require('../data/mockData');

// Get all demo data
router.get('/all', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      products: mockProducts,
      customers: mockCustomers,
      orders: mockOrders
    }
  });
});

// Seed mock data to localStorage (for client-side use)
router.post('/seed', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Mock data available. Copy this to localStorage:',
    data: {
      products: mockProducts,
      customers: mockCustomers,
      orders: mockOrders
    }
  });
});

module.exports = router;
