const express = require('express');
const router = express.Router();

router.get('/company-overview/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);        
        const data = await response.json();
        res.json(data);
        console.log('Company data fetched');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching company data');
    } 
});

router.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);
      const data = await response.json();
      res.json(data);
      console.log('Query results fetched');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching search results');
    }
  });

router.get('/historical/:symbol/:period/:interval', async (req, res) => {
  try {
    const symbol = req.params.symbol; // symbol = 'AAPL'
    const period = req.params.period; // period = "3M"
    const interval = req.params.interval; // interval = "60min"
    console.log({interval});

    let APIType;
    let url;
    switch (period) {
      case '1D':
      case '1W':
      case '1M':
        APIType = 'TIME_SERIES_INTRADAY';
        url = `https://www.alphavantage.co/query?function=${APIType}&symbol=${symbol}&interval=${interval}&extended_hours=false&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
        break;
      default:
        APIType = 'TIME_SERIES_DAILY_ADJUSTED';
        url = `https://www.alphavantage.co/query?function=${APIType}&symbol=${symbol}&outputsize=full&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
    console.log(`Historical ${period} data fetched`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching historical data');
  } 
});

module.exports = router;