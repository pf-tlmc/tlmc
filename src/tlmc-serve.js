/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const ls = require('ls-serialize');
const csvStringify = require('csv-stringify/lib/sync');
const csvParse = require('csv-parse/lib/sync');
const readCues = require('./readCues');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_PATH = process.argv[3] || process.env.TLMC_PATH || '/mnt/TouhouBox/tlmc';
const LS_CACHE_PATH = path.join(__dirname, 'ls.cache');
const CUE_CACHE_PATH = path.join(__dirname, 'cue.cache');

{
  // Initialize `ls.cache`
  try {
    fs.accessSync(LS_CACHE_PATH);
    console.log('ls-cache found. Using cache.');
  }

  catch (err) {
    console.log('No ls-cache found. Creating directory structure...');
    const directoryString = ls.serialize(TLMC_PATH);
    fs.writeFileSync(LS_CACHE_PATH, directoryString);
  }

  // Initialize `cue.cache`
  try {
    fs.accessSync(CUE_CACHE_PATH);
    console.log('cue-cache found. Using cache.');
  }

  catch (err) {
    console.log('No cue-cache found. Reading directory structure...');
    const directory = ls.deserialize(fs.readFileSync(LS_CACHE_PATH).toString());
    const songs = readCues(directory, TLMC_PATH);
    const songsString = csvStringify(songs, {header: true});
    fs.writeFileSync(CUE_CACHE_PATH, songsString);
  }

  // Check songs found
  console.log('Checking file paths...');
  const directory = ls.deserialize(fs.readFileSync(LS_CACHE_PATH).toString());
  const songs = csvParse(fs.readFileSync(CUE_CACHE_PATH).toString(), {columns: true});
  let failed = songs.filter(song => {
    let parts = song.path.split(path.sep);
    for (let index = 0, currDir = directory; index < parts.length - 1; ++index) {
      currDir = Array.from(currDir.files)[parts[index]];
      parts[index] = currDir.base;
    }

    try {
      fs.accessSync(path.join(TLMC_PATH, ...parts));
      return false;
    }
    catch (err) {
      console.log(`- ${path.join(...parts)}`);
      return true;
    }
  });

  if (failed.length) {
    console.log(`${failed.length} songs not found.`);
  }
  else {
    console.log('All OK!');
  }
}

const app = express();

app.use(compression({level: 9}));

app.use('/tlmc', express.static(TLMC_PATH));

app.get('/ls', (req, res) => {
  res.sendFile(LS_CACHE_PATH);
});
app.get('/cue', (req, res) => {
  res.sendFile(CUE_CACHE_PATH);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
