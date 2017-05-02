/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const express = require('express');
const request = require('request');
const compression = require('compression');
const ProgressBar = require('progress');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_SERVE_URL = process.argv[3] || process.env.TLMC_SERVE_URL || 'http://home.pf-n.co';
const WEBSITE_PATH = path.join(__dirname, 'website', 'index.html');
const PUBLIC_PATH = path.join(__dirname, 'website', 'public');
const LS_CACHE_PATH = path.join(__dirname, 'ls.cache');
const CUE_CACHE_PATH = path.join(__dirname, 'cue.cache');

{
  function fetch(url, path) {
    return new Promise((resolve, reject) => {
      try {
        fs.accessSync(path);
        resolve('cached');
      }

      catch (err) {
        request.get(url)
          .on('response', res => {
            var bar = new ProgressBar(
              `${url} [:bar] :rate/bps :percent :etas`,
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
            res.on('end', () => resolve());
          })
          .on('error', err => reject(err))
          .pipe(fs.createWriteStream(path));
      }
    });
  }

  fetch(`${TLMC_SERVE_URL}/ls`, LS_CACHE_PATH)
    .then(cached => cached && console.log('ls-cache found. Using cache.'))
    .then(() => fetch(`${TLMC_SERVE_URL}/cue`, CUE_CACHE_PATH))
    .then(cached => cached && console.log('cue-cache found. Using cache.'))
    .then(createServer);
}

function createServer() {
  // const directory = JSON.parse(fs.readFileSync(LS_CACHE_PATH));
  // const songs = parse.enumSongs(directory);
  const directoryString = fs.readFileSync(LS_CACHE_PATH);
  const app = express();

  app.use(compression({level: 9}));

  app.get('/tlmc/ls', (req, res) => {
    res.sendFile(LS_CACHE_PATH);
  });
  app.get('/tlmc/cue', (req, res) => {
    res.sendFile(CUE_CACHE_PATH);
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
    request.get(`${TLMC_SERVE_URL}${req.url}`, err => {
      if (err) {
        res.sendStatus(503);
      }
    }).pipe(res);
  });

  app.use('/public', express.static(PUBLIC_PATH));

  app.get('*', (req, res) => {
    res.sendFile(WEBSITE_PATH);
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
