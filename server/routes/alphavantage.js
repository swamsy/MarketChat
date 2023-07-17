const express = require('express');
const router = express.Router();

router.get('/company-overview/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);        
        const data = await response.json();
        res.json(data);
        console.log('Company data fetched');
    } catch (error) {
        console.error(error);
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
  
  module.exports = router;