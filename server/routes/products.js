const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const productService = require('../services/productService');
const { validateProduct } = require('../utils/validation');

// Get all products
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const products = await productService.getAll(req.user.uid);
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id, req.user.uid);
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    const product = await productService.create(req.body, req.user.uid);
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }

    const product = await productService.update(req.params.id, req.body, req.user.uid);
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const result = await productService.delete(req.params.id, req.user.uid);
    res.json({
      success: true,
      data: result,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
