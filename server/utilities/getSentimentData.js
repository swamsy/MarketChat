async function getSentimentData(symbol) {
    try {
        const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&sort=RELEVANCE&apikey=${process.env.ALPHAVANTAGE_API_KEY}`);
        const data = await response.json();

        const extractedData = {
            sentiment_score_definition: data.sentiment_score_definition,
            relevance_score_definition: data.relevance_score_definition,
            feed: data.feed.slice(0, 10).map(item => {
                return {
                    summary: item.summary,
                    source: item.source,
                    overall_sentiment_score: item.overall_sentiment_score,
                    overall_sentiment_label: item.overall_sentiment_label,
                    ticker_sentiment: item.ticker_sentiment.filter(ticker => ticker.ticker === symbol)
                };
            })
        };
        return extractedData;
        console.log(extractedData);

    } catch (err) {
        console.error(err);
        return null;
    } 
};

module.exports = getSentimentData;