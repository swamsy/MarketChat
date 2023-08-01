const express = require('express');
const router = express.Router();
const SearchResult = require('../models/SearchResult');

router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        const searchResults = await SearchResult.aggregate([
            {
                $search: {
                    compound: {
                        should: [
                            {
                                autocomplete: {
                                    query: query,
                                    path: "symbol",
                                    score: { boost: { value: 5 } }, // prioritize stock ticker symbol matches over company name matches
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
                        ]
                    }
                }
            },
            {
                $project: {
                    symbol: 1,
                    name: 1,
                    score: { $meta: "searchScore" }
                }
            },
            {
                $limit: 10
            }
        ]);
        res.json(searchResults);
        console.log('Search results fetched', searchResults);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching search results');
    }

});

module.exports = router;