const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Check env vars
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}

const FINAL_URL = SUPABASE_URL || 'https://your-project.supabase.co';
const FINAL_KEY = SUPABASE_ANON_KEY || 'your-anon-key';

app.use(cors());
app.use(express.json());

function injectCredentials(filePath) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace(/{{SUPABASE_URL}}/g, FINAL_URL);
    html = html.replace(/{{SUPABASE_ANON_KEY}}/g, FINAL_KEY);
    return html;
  } catch (err) {
    console.error(`❌ Error reading ${filePath}:`, err.message);
    return null;
  }
}

app.get('/login', (req, res) => {
  const html = injectCredentials(path.join(__dirname, 'login.html'));
  if (!html) return res.status(404).send('login.html not found');
  res.send(html);
});

app.get('/sender', (req, res) => {
  const html = injectCredentials(path.join(__dirname, 'sender.html'));
  if (!html) return res.status(404).send('sender.html not found');
  res.send(html);
});

app.get('/receiver', (req, res) => {
  const html = injectCredentials(path.join(__dirname, 'receiver.html'));
  if (!html) return res.status(404).send('receiver.html not found');
  res.send(html);
});

app.get('/login.html', (req, res) => res.redirect('/login'));
app.get('/sender.html', (req, res) => res.redirect('/sender'));
app.get('/receiver.html', (req, res) => res.redirect('/receiver'));

app.get('/', (req, res) => res.redirect('/login'));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔐 Login: http://localhost:${PORT}/login`);
  console.log(`📤 Sender: http://localhost:${PORT}/sender`);
  console.log(`📥 Receiver: http://localhost:${PORT}/receiver`);
});
