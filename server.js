const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Redirect naked domain to www
app.use((req, res, next) => {
  if (req.headers.host === 'neoatyourservice.com') {
    return res.redirect(301, 'https://www.neoatyourservice.com' + req.url);
  }
  next();
});

// Serve static files (images, css, etc)
app.use(express.static(path.join(__dirname)));

// Always serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Neo site running on port ${PORT}`);
});
