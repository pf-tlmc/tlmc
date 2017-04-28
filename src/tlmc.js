/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const express = require('express');
const request = require('request');
const compression = require('compression');
const ProgressBar = require('progress');
// const parse = require('./parse');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_SERVE_URL = process.argv[3] || process.env.TLMC_SERVE_URL || 'http://home.pf-n.co';
const WEBSITE_PATH = path.join(__dirname, 'website', 'index.html');
const PUBLIC_PATH = path.join(__dirname, 'website', 'public');
const LS_CACHE_PATH = path.join(__dirname, 'ls.cache');

try {
  fs.accessSync(LS_CACHE_PATH);
  console.log('Cache found. Reading from cache.');
  createServer();
}

catch (err) {
  console.log('No cache found. Fetching directory structure...');
  request.get(`${TLMC_SERVE_URL}/ls`)
    .on('response', res => {
      var bar = new ProgressBar(
        `${TLMC_SERVE_URL}/ls [:bar] :rate/bps :percent :etas`,
        {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: +res.headers['content-length']
        }
      );

      res.on('data', chunk => {
        bar.tick(chunk.length);
      });

      res.on('end', () => {
        console.log('Directory fetched.');
        createServer();
      });
    })
    .on('error', err => {
      console.log(`Could not fetch \`${TLMC_SERVE_URL}/ls\`. Please make sure tlmc-serve is running, or try again.`);
      console.log(err);
    })
    .pipe(fs.createWriteStream(LS_CACHE_PATH));
}

function createServer() {
  // const directory = JSON.parse(fs.readFileSync(LS_CACHE_PATH));
  // const songs = parse.enumSongs(directory);
  const directoryString = fs.readFileSync(LS_CACHE_PATH);
  const app = express();

  app.use(compression());

  app.get('/tlmc/ls', (req, res) => {
    res.send(directoryString);
  });

  // app.get('/tlmc/id/:id', (req, res) => {
  //   const index = +req.params.id - 1;
  //   const songPath = songs[index];
  //   if (!songPath) {
  //     return res.sendStatus(404);
  //   }
  //
  //   const cleanPath = songPath.split('/').map(encodeURIComponent).join('/');
  //   request.get(`${TLMC_SERVE_URL}/tlmc/${cleanPath}`).pipe(res);
  // });

  app.get(/^\/tlmc\/(.+)/, (req, res) => {
    const [tlmcPath] = req.params;

    request.get(`${TLMC_SERVE_URL}/tlmc/${tlmcPath}`).pipe(res);
  });

  app.use('/public', express.static(PUBLIC_PATH));

  app.get('*', (req, res) => {
    res.sendFile(WEBSITE_PATH);
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
