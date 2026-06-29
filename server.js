const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Read environment variables ──────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Serve HTML files with injected Supabase credentials ──
function injectCredentials(htmlPath) {
  let html = fs.readFileSync(path.join(__dirname, 'public', htmlPath), 'utf8');
  // Replace placeholders with actual values from .env
  html = html.replace(/{{SUPABASE_URL}}/g, SUPABASE_URL);
  html = html.replace(/{{SUPABASE_ANON_KEY}}/g, SUPABASE_ANON_KEY);
  return html;
}

app.get('/sender.html', (req, res) => {
  res.send(injectCredentials('sender.html'));
});

app.get('/receiver.html', (req, res) => {
  res.send(injectCredentials('receiver.html'));
});

// ─── Landing page ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Secure Exchange</title></head>
    <body style="font-family:system-ui;max-width:600px;margin:60px auto;padding:20px;">
      <h1>🔒 Secure Message Exchange</h1>
      <p>Choose your role:</p>
      <ul>
        <li><a href="/sender.html">📤 Sender (User 2)</a></li>
        <li><a href="/receiver.html">📥 Receiver (User 1)</a></li>
      </ul>
      <p><small>Make sure your <code>.env</code> file has the correct Supabase credentials.</small></p>
    </body>
    </html>
  `);
});

// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📤 Sender: http://localhost:${PORT}/sender.html`);
  console.log(`📥 Receiver: http://localhost:${PORT}/receiver.html`);
});