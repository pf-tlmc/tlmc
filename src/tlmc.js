const path = require('path');
const fs = require('fs');
const express = require('express');
const request = require('request');
const compression = require('compression');
const ProgressBar = require('progress');
const parse = require('./parse');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_SERVE_URL = process.argv[3] || process.env.TLMC_SERVE_URL || 'http://192.168.1.62:8080';
const WEBSITE_PATH = path.join(__dirname, 'website', 'index.html');
const PUBLIC_PATH = path.join(__dirname, 'website', 'public');
const CACHE_PATH = path.join(__dirname, 'ls.cache.json');

/* eslint-disable no-console */
let cacheExists;
try {
  fs.accessSync(CACHE_PATH);
  cacheExists = true;
}
catch (err) {
  cacheExists = false;
}

if (!cacheExists) {
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
    .pipe(fs.createWriteStream(CACHE_PATH));
}
else {
  console.log('Cache found. Reading from cache.');
  createServer();
}

function createServer() {
  const directory = JSON.parse(fs.readFileSync(CACHE_PATH));
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

  app.use('/public', express.static(PUBLIC_PATH));

  app.get('*', (req, res) => {
    res.sendFile(WEBSITE_PATH);
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
/* eslint-enable no-console */
