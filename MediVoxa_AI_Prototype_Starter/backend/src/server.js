import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { query } from './db.js';

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 5000);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Please upload an image file.'));
  }
});

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'MediVoxa AI API' }));

app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();
    if (!message) return res.status(400).json({ error: 'Please enter a question.' });
    if (message.length > 4000) return res.status(400).json({ error: 'Question is too long.' });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Chatbot is not configured yet. Add GEMINI_API_KEY to backend/.env.' });
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are MediVoxa AI, a healthcare information assistant. Give general, cautious, plain-language information only. Do not diagnose, prescribe, recommend changing medication doses, or claim certainty from symptoms. Encourage a qualified healthcare professional for personal medical decisions. If symptoms may be immediately life-threatening, advise contacting local emergency services. State that you are an AI assistant, not a doctor.' }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 700 }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', data?.error?.message || response.status);
      return res.status(502).json({ error: 'AI service could not answer right now. Check the API key/model and try again.' });
    }
    const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n').trim();
    if (!answer) return res.status(502).json({ error: 'The AI returned an empty response. Please try again.' });
    res.json({ answer, disclaimer: 'General information only; not a medical diagnosis.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected server error.' });
  }
});

app.post('/api/skin/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Choose an image first.' });
  // INTEGRATION POINT: call your team's trained TensorFlow/Keras model here.
  // Do not return a fabricated prediction. Until a validated model is connected,
  // clearly tell the user that analysis is not enabled.
  res.json({
    filename: req.file.originalname,
    status: 'model_not_connected',
    message: 'Image received successfully, but the skin-analysis model is not connected yet. This prototype cannot diagnose a skin condition. Please consult a qualified healthcare professional for concerns.'
  });
});

app.post('/api/medicine/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Choose an image first.' });
  // INTEGRATION POINT: add OCR (e.g. Tesseract) and a trusted medicine reference.
  // Never claim that a tablet is identified from appearance alone.
  res.json({
    filename: req.file.originalname,
    status: 'ocr_not_connected',
    message: 'Image received. Automatic medicine identification is not enabled yet. Read the packaging and verify the medicine with a pharmacist. Do not take an unknown pill based on an image.'
  });
});

app.get('/api/health-records', async (_req, res) => {
  try {
    const result = await query('SELECT id, record_type, value_text, notes, created_at FROM health_records ORDER BY created_at DESC LIMIT 100');
    res.json({ records: result.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/health-records', async (req, res) => {
  try {
    const { record_type, value_text, notes = '' } = req.body || {};
    const allowed = ['blood_pressure', 'blood_sugar', 'weight'];
    if (!allowed.includes(record_type)) return res.status(400).json({ error: 'Invalid record type.' });
    if (!String(value_text || '').trim()) return res.status(400).json({ error: 'Enter a measurement.' });
    if (String(value_text).length > 100 || String(notes).length > 1000) return res.status(400).json({ error: 'Input is too long.' });
    const result = await query(
      'INSERT INTO health_records (record_type, value_text, notes) VALUES ($1, $2, $3) RETURNING id, record_type, value_text, notes, created_at',
      [record_type, String(value_text).trim(), String(notes).trim()]
    );
    res.status(201).json({ record: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Could not save record. Check the database setup.' }); }
});

app.get('/api/reminders', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM reminders ORDER BY reminder_time ASC');
    res.json({ reminders: result.rows });
  } catch (err) { res.status(500).json({ error: 'Could not load reminders. Check the database setup.' }); }
});

app.post('/api/reminders', async (req, res) => {
  try {
    const { medicine_name, instructions = '', reminder_time, start_date } = req.body || {};
    if (!String(medicine_name || '').trim()) return res.status(400).json({ error: 'Enter a medicine name.' });
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(reminder_time || ''))) return res.status(400).json({ error: 'Choose a valid time.' });
    if (String(medicine_name).length > 160 || String(instructions).length > 300) return res.status(400).json({ error: 'Input is too long.' });
    const result = await query(
      `INSERT INTO reminders (medicine_name, instructions, reminder_time, start_date) VALUES ($1, $2, $3, COALESCE($4, date('now'))) RETURNING *`,
      [String(medicine_name).trim(), String(instructions).trim(), reminder_time, start_date || null]
    );
    res.status(201).json({ reminder: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Could not save reminder. Check the database setup.' }); }
});

app.patch('/api/reminders/:id', async (req, res) => {
  try {
    const active = Boolean(req.body?.active);
    const result = await query('UPDATE reminders SET active=$1 WHERE id=$2 RETURNING *', [active, Number(req.params.id)]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Reminder not found.' });
    res.json({ reminder: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Could not update reminder.' }); }
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Image must be 5 MB or smaller.' });
  res.status(400).json({ error: err.message || 'Invalid request.' });
});

app.listen(port, () => console.log(`MediVoxa API running at http://localhost:${port}`));
