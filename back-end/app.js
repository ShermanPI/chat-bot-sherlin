import express from 'express';
import OpenAI from 'openai';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.ALLOWED_HOST || '*', // Permite todas las solicitudes en desarrollo
};
app.use(cors(corsOptions));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ruta del archivo JSON con los datos preprocesados
const resultadosPath = path.join(__dirname, 'resultados_clasificados.json');
let resultados = [];

// Cargar los datos preprocesados al iniciar el servidor
fs.readFile(resultadosPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error al cargar los datos preprocesados:', err);
  } else {
    try {
      resultados = JSON.parse(data);
      console.log('Datos preprocesados cargados correctamente.');
    } catch (parseError) {
      console.error('Error al parsear los datos preprocesados:', parseError);
    }
  }
});

// Endpoint principal del chatbot
app.post('/chat', async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'Falta el mensaje del usuario.' });
  }

  try {
    // Filtrar opiniones relevantes (palabras clave en título o texto de la reseña)
    const relatedResults = resultados.filter(r => {
      const messageLower = userMessage.toLowerCase();
      return (
        (r.review_text && r.review_text.toLowerCase().includes(messageLower)) ||
        (r.review_title && r.review_title.toLowerCase().includes(messageLower))
      );
    });

    // Contar opiniones positivas y negativas
    const totalPositivas = resultados.filter(r => r.predicted_class_svm === 2).length;
    const totalNegativas = resultados.filter(r => r.predicted_class_svm === 1).length;

    // Construir el prompt con datos preprocesados
    let prompt = `Eres Sherlin, una experta en clasificar opiniones de productos en Amazon. Aquí tienes algunas opiniones relevantes basadas en tus datos:

`;

    if (relatedResults.length > 0) {
      relatedResults.slice(0, 5).forEach((result, index) => {
        prompt += `Opinión ${index + 1}:
`;
        if (result.review_title) {
          prompt += `Título: "${result.review_title}".
`;
        }
        prompt += `Texto: "${result.review_text}". Clasificación: ${
          result.predicted_class_svm === 1 ? 'Negativa' : 'Positiva'
        }.

`;
      });
      prompt += `En total, encontré ${relatedResults.length} opiniones relacionadas. De estas, ${totalPositivas} son positivas y ${totalNegativas} son negativas.
`;
    } else {
      prompt += `No se encontraron opiniones relacionadas directamente con esta consulta. Sin embargo, en el conjunto total de reseñas, hay ${totalPositivas} opiniones positivas y ${totalNegativas} negativas.
`;
    }

    prompt += `El usuario ha preguntado: "${userMessage}". Proporciona una respuesta clara, cálida y útil basada en la información anterior. Concéntrate en los puntos positivos y negativos más relevantes y evita generalidades.`;

    // Llamar a la API de ChatGPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: "Responde como Sherlin, de manera cálida, profesional y específica." },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300, 
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content;

    // Responder al usuario
    res.status(200).json({
      response: botResponse,
      relatedResults: relatedResults.slice(0, 5), // Devuelve las opiniones más relevantes
    });
  } catch (error) {
    console.error('Error creando la respuesta del chatbot:', error);
    res.status(500).json({ error: 'Error al generar la respuesta del chatbot.' });
  }
});

// Endpoint para verificar el estado del servidor
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'Servidor en funcionamiento', version: '1.0.0' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
