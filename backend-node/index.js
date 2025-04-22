import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { command } = req.body;
  console.log('🧠 Received:', command);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: command }]
        }]
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not understand that.';
    res.json({ reply });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ reply: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Node.js backend is running at http://localhost:${PORT}`);
});
