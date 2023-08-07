const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const getSentimentData = require('../utilities/getSentimentData');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/gpt-3.5-turbo', async (req, res) => {
    try {
        const message = req.body.message;
        const symbol = req.body.symbol;
        let sentimentData = null;
        let messages = [
            {
                "role": "system",
                "content": "You are Mark, a chat bot companion for my website MarketChat, who can give financial analysis on different stock tickers."
            },
            {
                "role": "user",
                "content": message
            }
        ]
        
        if (message.includes(`current market sentiment on`)) {
            sentimentData = await getSentimentData(symbol);
            console.log(sentimentData);
            if(sentimentData) {
                // Add sentiment data to the message array as context
                messages.push({
                    "role": "system",
                    "content": `I am going to give you the current market news & sentiment data for ${symbol}. I want you to look through the data and give an extremely concise sumamry to the user, making sure to analyze whether people are bullish or bearish on the stock. Try to stick to only talking about the current stock ticker at hand unless it's important to note another stock ticker (such as a competitor or something of that nature). Here's the sentiment data: ${JSON.stringify(sentimentData)}`
                });
            }
        }

        console.log(messages);
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        res.json(response.data)
        console.log('AI response fetched')

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching AI response');
    }
});

module.exports = router;