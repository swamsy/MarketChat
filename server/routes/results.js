const express = require('express');
const router = express.Router();
const SearchResult = require('../models/SearchResult');

router.get('/search', async (req, res) => {
    try {
        //console.log("Server req:", req);
        const query = req.query.query;
        // Check if the query is empty or whitespace only
        if (!query || /^\s*$/.test(query)) {
            return res.json([]);
        }

        const searchResults = await SearchResult.aggregate([
            {
                $search: {
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: "symbol",
                                    score: { boost: { value: 2 } }, // prioritize stock ticker symbol matches over company name matches
                                    tokenOrder: "sequential"
                                }
                            },
                            {
                                autocomplete: {
                                    query: query,
                                    path: "name",
                                    score: { boost: { value: 1 } },
                                    tokenOrder: "sequential"
                                }
                            }
                        ],
                        minimumShouldMatch: 1
                    }
                }
            },
            {
                $project: {
                    symbol: 1,
                    name: 1,
                    logo: 1,
                    score: { $meta: "searchScore" }
                }
            },
            {
                $limit: 4
            }
        ]);
        res.json(searchResults);
        console.log('Search results fetched');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching search results');
    }

});

router.get('/logo/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const company = await SearchResult.findOne({ symbol: symbol });
        res.json(company.logo);
        console.log('Logo fetched');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching logo');
    }
});


module.exports = router;