const express = require('express');
const request = require('request');
const parse = require('./parse');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_SERVE_URL = process.argv[3] || process.env.TLMC_SERVE_URL || 'http://home.pf-n.co';

/* eslint-disable no-console */
console.log('Fetching directory structure...');
request.get(`${TLMC_SERVE_URL}/ls`, (err, res, body) => {
  if (!body) {
    console.log(`Could not fetch \`${TLMC_SERVE_URL}/ls\`. Please make sure tlmc-serve is running.`);
    console.log(err);
    return;
  }

  console.log('Directory fetched.');
  createServer(body);
});

function createServer(directoryString) {
  const directory = JSON.parse(directoryString);
  const songs = parse.enumSongs(directory);

  const app = express();

  app.get('/tlmc/id/:id', (req, res) => {
    const index = +req.params.id - 1;
    const songPath = songs[index];
    if (!songPath) {
      return res.sendStatus(404);
    }

    request.get(`${TLMC_SERVE_URL}/tlmc/${songPath}`).pipe(res);
  });

  app.get(/^\/tlmc\/(.+)/, (req, res) => {
    const [tlmcPath] = req.params;

    request.get(`${TLMC_SERVE_URL}/tlmc/${tlmcPath}`).pipe(res);
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
/* eslint-enable no-console */
