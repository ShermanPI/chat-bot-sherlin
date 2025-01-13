import express from 'express';
import OpenAI from 'openai';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors package

const app = express();
const port = 3000;

app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.ALLOWED_HOST,
};
app.use(cors(corsOptions));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'Falta el mensaje del usuario.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: "Eres Sherlin, una guía turística amigable y experta en República Dominicana. Tu objetivo es ayudar a los viajeros con recomendaciones personalizadas sobre destinos turísticos, cultura local, comida típica, actividades al aire libre, y cualquier otra información útil para explorar el país. Responde de manera clara, cálida y profesional, asegurándote de que el usuario se sienta bienvenido y emocionado por visitar República Dominicana." },
        { role: 'user', content: userMessage },
      ],
    });

    const botResponse = completion.choices[0].message.content;
    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Error creando la respuesta del chatbot:", error);
    res.status(500).json({ error: 'Error al generar la respuesta del chatbot.' });
  }
});

app.get('/status', (req, res) => {
  res.status(200).json({ status: 'Servidor en funcionamiento', version: '1.0.0' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});