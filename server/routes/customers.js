const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const customerService = require('../services/customerService');
const { validateCustomer } = require('../utils/validation');

// Get all customers
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const customers = await customerService.getAll(req.user.uid);
    res.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    next(error);
  }
});

// Get single customer
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const customer = await customerService.getById(req.params.id, req.user.uid);
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
});

// Create customer
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const errors = validateCustomer(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    const customer = await customerService.create(req.body, req.user.uid);
    res.status(201).json({
      success: true,
      data: customer,
      message: 'Customer created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update customer
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const errors = validateCustomer(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    const customer = await customerService.update(req.params.id, req.body, req.user.uid);
    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete customer
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await customerService.delete(req.params.id, req.user.uid);
    res.json({
      success: true,
      data: result,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
