const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

app.use(cors());
app.use(express.json());

// ─── Helper to inject credentials ──────────────────────────
function injectCredentials(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/{{SUPABASE_URL}}/g, SUPABASE_URL);
  html = html.replace(/{{SUPABASE_ANON_KEY}}/g, SUPABASE_ANON_KEY);
  return html;
}

// ─── Routes for sender and receiver (no .html) ────────────
app.get('/sender', (req, res) => {
  res.send(injectCredentials(path.join(__dirname, 'sender.html')));
});

app.get('/receiver', (req, res) => {
  res.send(injectCredentials(path.join(__dirname, 'receiver.html')));
});

// ─── Also support .html extension (redirect) ──────────────
app.get('/sender.html', (req, res) => {
  res.redirect('/sender');
});
app.get('/receiver.html', (req, res) => {
  res.redirect('/receiver');
});

// ─── Landing page ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Secure Exchange</title></head>
    <body style="font-family:system-ui;max-width:600px;margin:60px auto;padding:20px;">
      <h1>🔒 Secure Message Exchange</h1>
      <p>Choose your role:</p>
      <ul>
        <li><a href="/sender">📤 Sender (User 2)</a></li>
        <li><a href="/receiver">📥 Receiver (User 1)</a></li>
      </ul>
      <p><small>Make sure your <code>.env</code> file has the correct Supabase credentials.</small></p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📤 Sender: http://localhost:${PORT}/sender`);
  console.log(`📥 Receiver: http://localhost:${PORT}/receiver`);
});
