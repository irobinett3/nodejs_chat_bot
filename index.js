import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { textData } from './data.js'; // Assuming textData is correctly exported from data.js
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [];

app.get('/', (req, res) => {
    res.send('Chatbot is running');
});

app.post('/chat', async (req, res) => {
    try {
        const userInput = req.body.message;

        if (!userInput) {
            throw new Error('Empty message received');
        }

        conversationHistory.push({ role: 'user', content: userInput });

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: conversationHistory,
        });

        const responseMessage = chatCompletion.choices[0].message.content;

        conversationHistory.push({ role: 'assistant', content: responseMessage });

        console.log('Chatbot:', responseMessage);

        res.json({ message: responseMessage });
    } catch (error) {
        console.error('Error during chat completion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});