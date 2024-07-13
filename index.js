import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import cors from 'cors';
import { textData } from './data.js'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.options('/chat', cors({
    origin: 'https://personal-website-git-master-ian-robinetts-projects-ce4861df.vercel.app', // Replace with your actual frontend domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Enable CORS for all routes
app.use(cors({
    origin: 'https://personal-website-git-master-ian-robinetts-projects-ce4861df.vercel.app', // Replace with your actual frontend domain
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [];

conversationHistory.push({role: 'system', content: textData.join('\n') })

app.get('/', (req, res) => {
    res.send('Chatbot is running');
});

app.post('/chat', async (req, res) => {
    try {
        const userInput = req.body.message;

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
        console.error('Error during chat completion:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});