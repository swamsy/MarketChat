const express = require('express');
const router = express.Router();

router.get('/company-overview/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);        
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching company data');
    } 
});

module.exports = router;
