const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const getSentimentData = require('../utilities/getSentimentData');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let fullMessage = null;

router.post('/gpt-3.5-turbo/send', async (req, res) => {
    try {
        const message = req.body.message;
        const symbol = req.body.symbol;

        let sentimentData = null;
        let messages = [
            {
                "role": "system",
                "content": "You are Mark, a chat bot companion for my website MarketChat, who can give financial analysis on different stock tickers. MarketChat is a website that features up-to-date stock price history for all of the stocks in the NASDAQ and the NYSE, a chatbot that can answer questions about all of those stocks, and there is also a company description along with important information about the stock and the stock's 'key data'. The About Section includes the description of the company, the sector, the industry, stock exchange, country, and dividend date. The Key Data section includes Market capitalization, P/E ratio, 52 week range, dividend yield, and EPS. It was created by Michael Swan, a Computer Science Student at the University of Connecticut. You can find his personal portfolio online at mswan.dev. "
            },
            {
                "role": "user",
                "content": message
            }
        ]
        
        if (message.includes(`current market sentiment on`)) {
            sentimentData = await getSentimentData(symbol);
            if(sentimentData) {
                // Add sentiment data to the message array as context
                messages.push({
                    "role": "system",
                    "content": `I am going to give you the current market news & sentiment data for ${symbol}. I want you to look through the data and give an extremely concise sumamry to the user, making sure to analyze whether people are bullish or bearish on the stock. Stick to only talking about the current stock ticker at hand unless it's important to note another stock ticker (such as a competitor or something of that nature). Here's the sentiment data: ${JSON.stringify(sentimentData)}`
                });
            }
        }
        fullMessage = messages;

        res.status(200).send('Message processed');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing message');
    }
});

router.get('/gpt-3.5-turbo/stream', async (req, res) => {
    console.log("Accessed /gpt-3.5-turbo/stream endpoint");
    try {
        const messages = fullMessage;
        console.log("Messages:",messages)
        fullMessage = null;

        const responseStream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            stream: true
        });

        console.log("Setting headers for SSE");
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        console.log("Sending response for streaming endpoint with status:", res.statusCode);
        console.log("Starting OpenAI streaming");
        for await (const chunk of responseStream) {
            const chunkMessage = chunk.choices[0];
            console.log(chunkMessage);
            res.write(`data: ${JSON.stringify(chunkMessage)}\n\n`);
        }
        console.log("Finished OpenAI streaming");
        res.end();
        console.log("Closing SSE stream");
        console.log('AI response fetched')

    } catch (err) {
        console.error("Error in /gpt-3.5-turbo/stream:", err);
        res.status(500).send('Error fetching AI response');
    }
});

module.exports = router;