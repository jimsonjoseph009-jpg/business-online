const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Mock data storage
let reviews = [];
let reviewId = 1;

// Get all reviews
router.get('/', authenticateToken, (req, res) => {
  try {
    res.json(reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticateToken, (req, res) => {
  try {
    const { author, rating, title, content, productId, verifiedPurchase, images } = req.body;
    const newReview = {
      id: reviewId++,
      author,
      rating,
      title,
      content,
      productId,
      verifiedPurchase: verifiedPurchase || false,
      images: images || [],
      helpful: 0,
      createdAt: new Date()
    };
    reviews.push(newReview);
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as helpful
router.post('/:id/helpful', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const review = reviews.find(r => r.id === parseInt(id));
    if (review) {
      review.helpful = (review.helpful || 0) + 1;
      res.json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify purchase
router.patch('/:id/verify', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const review = reviews.find(r => r.id === parseInt(id));
    if (review) {
      review.verifiedPurchase = true;
      res.json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    reviews = reviews.filter(r => r.id !== parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
