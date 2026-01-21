const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const orderService = require('../services/orderService');
const { validateOrder } = require('../utils/validation');

// Get all orders
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const orders = await orderService.getAll(req.user.uid);
    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    next(error);
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const order = await orderService.getById(req.params.id, req.user.uid);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// Create order
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const errors = validateOrder(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    const order = await orderService.create(req.body, req.user.uid);
    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update order
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const errors = validateOrder(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    const order = await orderService.update(req.params.id, req.body, req.user.uid);
    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete order
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await orderService.delete(req.params.id, req.user.uid);
    res.json({
      success: true,
      data: result,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
