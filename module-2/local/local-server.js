/* eslint-disable no-unused-vars */
/*global __dirname*/

const path = require('path');
const express = require('express');
const csp = require('helmet-csp');
const cors = require('cors');

const app = express();
const hostname = 'localhost';
const port = 4200;
const remoteServer = 'http://localhost:8000';

// const cspOptions = { directives: { defaultSrc: ["'none'"] } };
const cspOptions = {
  directives: {
    defaultSrc: ["'none'"],
    styleSrc: [
      "'self'",
      remoteServer,
      "'sha256-o9ZhcNulQDao9zjNHhzmHEKLGW7CSOl4IJpZOn9kqEs='",
    ],
    scriptSrc: [
      "'self'",
      remoteServer,
      "'sha256-Ap6ADu6Jkp5Gk3Z1IfV684Oj/DcDb5igyTtN5FDOPog='",
    ],
    connectSrc: ["'self'", remoteServer],
    imgSrc: ["'self'"],
    frameSrc: ['https://www.w3.org'],
  },
};
app.use(csp(cspOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/local-api', (req, res) => {
  res.status(200).json({ result: 'Local Success' });
});

app.listen(port, hostname, () => {
  console.log(`Local server started http://${hostname}:${port}`);
});
