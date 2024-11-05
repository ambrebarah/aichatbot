import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Utiliser la clé API depuis les variables d'environnement
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const chatHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    const prompt = `Vous êtes un expert bienveillant en adoption d'animaux... \n\nChat historique:\n${chatHistory}\n\nAssistant:`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

app.post('/api/analyze-image', async (req, res) => {
  try {
    const { image } = req.body;
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageData = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    };

    const prompt = "Vous êtes un expert des animaux. Veuillez analyser cette image...";

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    res.json({ message: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the image' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
