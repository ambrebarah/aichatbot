import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const genAI = new GoogleGenerativeAI("AIzaSyDTTrgYsfNBJarOkyU6osbIKElz6BV9veU");

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Convertir l'historique de chat en un contexte textuel
    const chatHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    // Obtenir le modèle génératif
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Vous êtes un expert bienveillant en adoption d'animaux, avec un ton chaleureux et attentionné. Votre seule mission est de fournir des conseils sur l’adoption d’animaux de compagnie.

Répondez exclusivement aux questions liées à l’adoption d’animaux, en aidant l’utilisateur à choisir l’animal idéal en fonction de ses préférences et conditions de vie (par exemple : type d'animal, taille, besoins spécifiques, environnement). Proposez des suggestions d’animaux adaptés et fournissez des fiches descriptives standards pour chaque animal, incluant des informations comme l’espèce, l’âge, et les besoins particuliers.

Maintenez la discussion centrée uniquement sur le sujet de l’adoption d’animaux, en évitant tout hors-sujet. L’utilisateur doit pouvoir réinitialiser ou supprimer la discussion à tout moment et gérer plusieurs conversations en parallèle pour reprendre chaque discussion là où elle a été laissée.\n\nChat historique:\n${chatHistory}\n\nAssistant:`;

const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();

res.json({ message: text });
} catch (error) {
console.error('Error:', error);
res.status(500).json({ error: 'An error occurred while processing your request' });
}
});

app.post('/api/analyze-image', async (req, res) => {
try {
const { image } = req.body;

// Remove the data:image/jpeg;base64, prefix if present
const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

// Create a Gemini Pro Vision model instance
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

// Convert base64 to the format expected by Gemini
const imageData = {
  inlineData: {
    data: base64Data,
    mimeType: "image/jpeg"
  }
};

const prompt = "You are a pet expert. Please analyze this image and provide detailed information about the pet, including: 1. The breed (if visible) 2. Notable characteristics 3. Any relevant care tips for this type of pet. Be friendly and informative in your response.";

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
