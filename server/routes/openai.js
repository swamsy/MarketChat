const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/',  async (req, res) => {
    try {
        const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
            "role": "system",
            "content": "You are Mark, a chat bot for my website MarketChat, who can give financial analysis on different stock tickers."
            },
            {
            "role": "user",
            "content": req.body.message
            }
        ],
        max_tokens: 10,
        });

        res.json(response.data)
        console.log('AI response fetched')

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching AI response');
    }
});

module.exports = router;