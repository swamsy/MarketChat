const SearchResult = require('../models/SearchResult');

async function populateDatabase() {
    try {
        const urls = [
            'https://api.twelvedata.com/stocks?exchange=NASDAQ',
            'https://api.twelvedata.com/stocks?exchange=NYSE'
        ];

        const responses = await Promise.all(urls.map(url => fetch(url)));
        const datas = await Promise.all(responses.map(response => response.json()));

        console.log('Starting to populate DB');
        for (const data of datas) {
            for (const item of data.data) {
                const searchResult = new SearchResult({
                    symbol: item.symbol,
                    name: item.name,
                });
                await searchResult.save();
            }
        }
        console.log('Successfully populated the database');
    } catch (err) {
        console.error(err);
    }
};

async function start() {
    try {
        await populateDatabase();
        console.log('Database populated successfully');
    } catch (err) {
        console.error('Error populating the database:', err);
    }
}

module.exports = start;