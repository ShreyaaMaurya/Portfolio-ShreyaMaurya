import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 5174;
const databaseUrl = process.env.DATABASE_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist');

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set. Contact form submissions will fail until it is configured.');
}

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    })
  : null;

const createContactTable = async () => {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const cleanText = (value) => String(value || '').trim();

const validateContactPayload = ({ name, email, subject, message }) => {
  const cleaned = {
    name: cleanText(name),
    email: cleanText(email),
    subject: cleanText(subject),
    message: cleanText(message)
  };

  if (!cleaned.name || !cleaned.email || !cleaned.subject || !cleaned.message) {
    return { error: 'Please fill in every field.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
    return { error: 'Please enter a valid email address.' };
  }

  if (cleaned.name.length > 120 || cleaned.email.length > 180 || cleaned.subject.length > 180) {
    return { error: 'Name, email, or subject is too long.' };
  }

  if (cleaned.message.length > 3000) {
    return { error: 'Message must be 3000 characters or fewer.' };
  }

  return { data: cleaned };
};

app.use(express.json({ limit: '32kb' }));
app.use(express.static(distPath));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/api/contact', async (request, response) => {
  if (!pool) {
    response.status(500).json({ error: 'Database is not configured.' });
    return;
  }

  const validation = validateContactPayload(request.body || {});
  if (validation.error) {
    response.status(400).json({ error: validation.error });
    return;
  }

  const { name, email, subject, message } = validation.data;

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)`,
      [name, email, subject, message]
    );

    response.status(201).json({ ok: true });
  } catch (error) {
    console.error('Failed to save contact message:', error);
    response.status(500).json({ error: 'Could not save your message right now.' });
  }
});

app.get(/.*/, (_request, response) => {
  response.sendFile(path.join(distPath, 'index.html'));
});

createContactTable()
  .then(() => {
    app.listen(port, () => {
      console.log(`Portfolio server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to prepare database:', error);
    process.exit(1);
  });
