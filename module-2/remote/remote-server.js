const path = require('path');
const express = require('express');
const csp = require('helmet-csp');
const cors = require('cors');

const app = express();
const hostname = 'localhost';
const port = 8000;

// CORS for fetch & XMLHttpRequest
// https://flaviocopes.com/express-cors/
const corsOptions = {
  origin: 'http://localhost:4200',
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/remote-api', cors(corsOptions), (req, res, next) => {
  res.status(200).json({ result: 'Remote Success' });
});

const server = app.listen(port, hostname, () => {
  console.log(`Remote server started http://${hostname}:${port}`);
});
