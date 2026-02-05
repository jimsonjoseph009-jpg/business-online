const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Mock data storage
let notifications = [];
let notificationId = 1;

// Get all notifications
router.get('/', authenticateToken, (req, res) => {
  try {
    res.json(notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notification
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, message, type, metadata } = req.body;
    const newNotification = {
      id: notificationId++,
      title,
      message,
      type,
      metadata,
      read: false,
      createdAt: new Date()
    };
    notifications.push(newNotification);
    res.json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const notif = notifications.find(n => n.id === parseInt(id));
    if (notif) {
      notif.read = read;
      res.json(notif);
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    notifications = notifications.filter(n => n.id !== parseInt(id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
