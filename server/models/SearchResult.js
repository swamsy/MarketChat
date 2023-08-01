const mongoose = require('mongoose');

const searchResultSchema = new mongoose.Schema({
    symbol: String,
    name: String,
    logo: String,
});

const searchResult = mongoose.model('SearchResult', searchResultSchema);

module.exports = searchResult;
