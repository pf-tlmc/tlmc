const path = require('path');
const express = require('express');
const request = require('request');
const compression = require('compression');
const parse = require('./parse');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_SERVE_URL = process.argv[3] || process.env.TLMC_SERVE_URL || 'http://home.pf-n.co';
const BUNDLE_PATH = path.join(__dirname, 'website', 'bundle.js');
const WEBSITE_PATH = path.join(__dirname, 'website', 'index.html');

/* eslint-disable no-console */
console.log('Fetching directory structure...');
request.get({url: `${TLMC_SERVE_URL}/ls`, json: true}, (err, res, body) => {
  if (!body) {
    console.log(`Could not fetch \`${TLMC_SERVE_URL}/ls\`. Please make sure tlmc-serve is running.`);
    console.log(err);
    return;
  }

  console.log('Directory fetched.');
  createServer(body);
});

function createServer(directory) {
  const songs = parse.enumSongs(directory);
  const directoryString = JSON.stringify(directory);
  const app = express();

  app.use(compression());

  app.get('/tlmc/ls', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(directoryString);
  });

  app.get('/tlmc/id/:id', (req, res) => {
    const index = +req.params.id - 1;
    const songPath = songs[index];
    if (!songPath) {
      return res.sendStatus(404);
    }

    const cleanPath = songPath.split('/').map(encodeURIComponent).join('/');
    request.get(`${TLMC_SERVE_URL}/tlmc/${cleanPath}`).pipe(res);
  });

  app.get(/^\/tlmc\/(.+)/, (req, res) => {
    const [tlmcPath] = req.params;

    request.get(`${TLMC_SERVE_URL}/tlmc/${tlmcPath}`).pipe(res);
  });

  app.get('/bundle.js', (req, res) => {
    res.sendFile(BUNDLE_PATH);
  });

  app.get('*', (req, res) => {
    res.sendFile(WEBSITE_PATH);
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
/* eslint-enable no-console */
