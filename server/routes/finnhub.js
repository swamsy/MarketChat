const express = require('express');
const router = express.Router();

router.get('/company-profile/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
        const data = await response.json();
        res.json(data);
        console.log('Company profile fetched');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching company profile");
    }
});

module.exports = router;