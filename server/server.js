const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./models/db');

const openaiRoutes = require('./routes/openai');
const alphavantageRoutes = require('./routes/alphavantage');
const finnhubRoutes = require('./routes/finnhub');
const chatRoutes = require('./routes/chats');
const resultRoutes = require('./routes/results');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/openai', openaiRoutes);
app.use('/alphavantage', alphavantageRoutes);
app.use('/finnhub', finnhubRoutes);
app.use('/chats', chatRoutes);
app.use('/results', resultRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

