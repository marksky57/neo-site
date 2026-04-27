require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const demoRoutes          = require('./routes/demo');
const onboardRoutes       = require('./routes/onboard');
const outboundRoutes      = require('./routes/outbound');
const notifyRoutes        = require('./routes/notify');
const stripeWebhookRoutes = require('./routes/stripe-webhook');
const stripeRoutes        = require('./routes/stripe-checkout');
const redirectRoutes      = require('./routes/redirect');
const vapiWebhookRoutes   = require('./routes/vapi-webhook');
const twilioSmsRoutes     = require('./routes/twilio-sms-webhook');
const setupRoutes         = require('./routes/setup');
const { startBillingScheduler } = require('./jobs/billing-scheduler');
const { initRedis } = require('./db');
const { runMigrations } = require('./db/migrate');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'https://neoatyourservice.com',
    'https://www.neoatyourservice.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.options('*', cors());

// ── Redirect naked domain to www ─────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.headers.host === 'neoatyourservice.com') {
    return res.redirect(301, 'https://www.neoatyourservice.com' + req.url);
  }
  next();
});

// ── Short link redirects (before body parsers — needs to be fast) ────────────
app.use('/r', redirectRoutes);

// ── Stripe webhook MUST come before express.json() ───────────────────────────
app.use('/api/stripe', stripeWebhookRoutes);

// ── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ─────────────────────────────────────────────────────────────
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
app.use('/audio', express.static(audioDir));

// Serve checkout form page
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/stripe', stripeRoutes);
app.use('/api/demo',    demoRoutes);
app.use('/api/onboard', onboardRoutes);
app.use('/api/outbound', outboundRoutes);
app.use('/api/notify',  notifyRoutes);
app.use('/api/setup',   setupRoutes);

// ── Webhook routes ───────────────────────────────────────────────────────────
app.use('/webhooks/vapi',       vapiWebhookRoutes);
app.use('/webhooks/twilio-sms', twilioSmsRoutes);

// Serve checkout page at /checkout
app.get('/checkout', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

// Serve billing confirmation page at /billing-confirmed
app.get('/billing-confirmed', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'billing-confirmed.html'));
});

// ── Debug env check ───────────────────────────────────────────────────────────
const REQUIRED_VARS = [
  'ELEVENLABS_API_KEY', 'ELEVENLABS_SARAH_VOICE_ID',
  'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN',
  'VAPI_API_KEY', 'STRIPE_SECRET_KEY', 'SENDGRID_API_KEY',
  'DATABASE_URL', 'REDIS_URL', 'BASE_URL'
];
app.get('/api/debug/env', (_req, res) => {
  const report = {};
  REQUIRED_VARS.forEach(v => { report[v] = !!process.env[v]; });
  res.json({ env: report, node_env: process.env.NODE_ENV || 'unset' });
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health',     (_req, res) => res.json({ status: 'ok', service: 'neo-backend', timestamp: new Date().toISOString() }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'neo-backend', timestamp: new Date().toISOString() }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function start() {
  // Run database migrations
  if (process.env.DATABASE_URL) {
    await runMigrations();
  }

  // Init Redis before starting server
  await initRedis().catch(err => console.warn('[REDIS] Init failed:', err.message));

  // Start billing scheduler
  if (process.env.DATABASE_URL) {
    startBillingScheduler();
  } else {
    console.warn('[SERVER] DATABASE_URL not set — billing scheduler disabled.');
  }

  app.listen(PORT, () => {
    console.log(`Neo Backend running on port ${PORT}`);
  });
}

start();
