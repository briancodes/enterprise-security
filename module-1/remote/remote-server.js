const path = require('path');
const express = require('express');
const csp = require('helmet-csp');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/remote-api', (req, res) => {
  res.status(200).json({ result: 'Remote Success' });
});

app.listen(8000);
