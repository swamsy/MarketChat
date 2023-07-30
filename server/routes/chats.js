const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

router.post('/save-message', (req, res) => {
  const { role, content } = req.body;
  const chatMessage = new ChatMessage({ role, content });
  chatMessage.save()
    .then(() => {
      console.log('Message saved successfully');
      res.status(200).json({ message: 'Message saved successfully' });
    })
    .catch(err => {
      console.error('Error saving message:', err.message);
      res.status(500).json({ error: err.message });
    })
});

module.exports = router;
