const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');

const parse = require('./parse');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_PATH = process.argv[3] || process.env.TLMC_PATH || '/mnt/TouhouBox/tlmc';
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

let songs;

if (!cacheExists) {
  console.log('No cache found. Creating directory structure...');
  const directory = parse.ls(TLMC_PATH);
  fs.writeFileSync(CACHE_PATH, JSON.stringify(directory));
  songs = parse.enumSongs(directory);
}
else {
  console.log('Cache found. Reading from cache.');
  songs = parse.enumSongs(JSON.parse(fs.readFileSync(CACHE_PATH)));
}

console.log('Checking file paths...');
let failed = songs.filter(song => {
  try {
    fs.accessSync(path.join(TLMC_PATH, song), fs.constants.R_OK);
    return false;
  }
  catch (error) {
    return true;
  }
});

if (failed.length) {
  console.log(`${failed.length} songs not found:`);
  console.log(failed.join('\n'));
}
else {
  console.log('All OK!');
}

const app = express();

app.use(compression({level: 9}));

app.use('/tlmc', express.static(TLMC_PATH));

app.get('/ls', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(CACHE_PATH);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
/* eslint-enable no-console */
