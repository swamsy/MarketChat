async function getSentimentData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&time_from=20230806T2000&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return null;
    } 
};

module.exports = getSentimentData;