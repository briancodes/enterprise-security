const path = require('path');
const express = require('express');
const csp = require('helmet-csp');
const cors = require('cors');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/local-api', (req, res) => {
  res.status(200).json({ result: 'Local Success' });
});

app.listen(4200);
