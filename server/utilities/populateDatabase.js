const SearchResult = require('../models/SearchResult');

async function getLogo(symbol) {
    try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`);
        const data = await response.json();
        return data.logo;
    } catch (err) {
        console.error(err);
        return null;
    }   
};

async function populateDatabase() {
    try {
        const urls = [
            'https://api.twelvedata.com/stocks?exchange=NASDAQ&type=Common%20Stock',
            'https://api.twelvedata.com/stocks?exchange=NYSE&type=Common%20Stock'
        ];

        const responses = await Promise.all(urls.map(url => fetch(url)));
        const datas = await Promise.all(responses.map(response => response.json()));

        const existingSymbols = await SearchResult.find({}).select('symbol');
        const existingSymbolSet = new Set(existingSymbols.map(item => item.symbol));

        console.log('Starting to populate DB');
        let count = 0;
        for (const data of datas) {
            for (const item of data.data) {
                if (!existingSymbolSet.has(item.symbol)) { // If the symbol doesn't exist in the database, add it
                    const logoUrl = await getLogo(item.symbol); // Retrieve logo URL
                    count++;
                    if (count % 60 === 0) {
                        console.log('Reached 60 API calls, waiting for 1 minute...');
                        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds
                    }
                    const searchResult = new SearchResult({
                        symbol: item.symbol,
                        name: item.name,
                        logo: logoUrl,
                    });
                    await searchResult.save();
                }
                existingSymbolSet.delete(item.symbol); // Remove the symbol from the set of existing symbols
            }
        }
        // Delete symbols from database that are no longer in the API
        for (const symbol of existingSymbolSet) {
            await SearchResult.deleteOne({ symbol });
        }

        console.log('Successfully populated the database');
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    populateDatabase,
    getLogo
};