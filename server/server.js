const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./models/db');

const chatbotRoutes = require('./routes/chatbot');
const alphavantageRoutes = require('./routes/alphavantage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/', chatbotRoutes);
app.use('/', alphavantageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

