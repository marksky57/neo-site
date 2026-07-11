// server.js — neo-site
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'https://neo-backend-production-dbd6.up.railway.app';

// Redirect naked domain to www
app.use((req, res, next) => {
  if (req.headers.host === 'neoatyourservice.com') {
    return res.redirect(301, 'https://www.neoatyourservice.com' + req.url);
  }
  next();
});

// training.neoatyourservice.com → serve the rep training page at the root.
// (Self-contained page: Tailwind + fonts via CDN, inline CSS/JS, so no local
// assets to resolve.) Other paths fall through to static, so /training.html
// still works on the main domain too.
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.startsWith('training.') && (req.path === '/' || req.path === '')) {
    return res.sendFile(path.join(__dirname, 'training.html'));
  }
  next();
});

// Serve static files (images, audio, etc)
app.use(express.static(path.join(__dirname)));

// /en → English site
app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// /es → Spanish site
app.get('/es', (req, res) => {
  res.sendFile(path.join(__dirname, 'index_es.html'));
});

// /training → rep training center (clean URL, no subdomain needed — avoids
// Railway's custom-domain plan limit). Works at neoatyourservice.com/training.
app.get('/training', (req, res) => {
  res.sendFile(path.join(__dirname, 'training.html'));
});

// /apply → remote phone-rep application form. Submits to the backend, which
// dials the applicant back with the Interview Assistant for a screening call.
app.get('/apply', (req, res) => {
  res.sendFile(path.join(__dirname, 'apply.html'));
});

// /salestools → ready-to-order sales tools (door hangers, magnets, riders…),
// each "Order yours" button pointing at the Sovrn affiliate link.
app.get('/salestools', (req, res) => {
  res.sendFile(path.join(__dirname, 'salestools.html'));
});

// /checkout → proxy to backend checkout form
app.get('/checkout', (req, res) => {
  const plan = req.query.plan || 'standard';
  res.redirect(302, `${BACKEND_URL}/checkout?plan=${plan}`);
});

// Root → detect browser language, redirect to /en or /es
app.get('/', (req, res) => {
  const acceptLang = req.headers['accept-language'] || '';
  const prefersSpanish = acceptLang.toLowerCase().startsWith('es');
  if (prefersSpanish) {
    return res.redirect(302, '/es');
  }
  return res.redirect(302, '/en');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Neo site running on port ${PORT}`);
});
