const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

router.post('/save-message', async (req, res) => {
  try {
    const { role, content } = req.body;
    const chatMessage = new ChatMessage({ role, content });
    await chatMessage.save()
    console.log('Message saved successfully');
    res.status(200).send('Message saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving message');
  }
});

module.exports = router;