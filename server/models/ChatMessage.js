const mongoose = require('mongoose');
const moment = require('moment-timezone');

const chatMessageSchema = new mongoose.Schema({
  role: String,
  content: String,
  timestamp: {
    type: String,
    default: () => moment().tz("America/New_York").format('MMMM Do YYYY, h:mm:ss A z')
    }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
