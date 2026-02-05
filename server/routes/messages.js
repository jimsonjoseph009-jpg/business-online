const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Mock data storage
let conversations = [];
let messages = [];
let conversationId = 1;
let messageId = 1;

// Get all conversations
router.get('/conversations', authenticateToken, (req, res) => {
  try {
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new conversation
router.post('/conversations', authenticateToken, (req, res) => {
  try {
    const { customerName, customerEmail, status } = req.body;
    const newConversation = {
      id: conversationId++,
      customerName,
      customerEmail,
      status,
      createdAt: new Date(),
      lastMessage: null
    };
    conversations.push(newConversation);
    res.json(newConversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update conversation status
router.patch('/conversations/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const conv = conversations.find(c => c.id === parseInt(id));
    if (conv) {
      conv.status = status;
      res.json(conv);
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a conversation
router.get('/messages/:conversationId', authenticateToken, (req, res) => {
  try {
    const { conversationId } = req.params;
    const convMessages = messages.filter(m => m.conversationId === parseInt(conversationId));
    res.json(convMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/messages', authenticateToken, (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;
    const newMessage = {
      id: messageId++,
      conversationId,
      sender,
      text,
      timestamp: new Date(),
      read: false
    };
    messages.push(newMessage);

    // Update conversation's last message
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text.substring(0, 50);
    }

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
