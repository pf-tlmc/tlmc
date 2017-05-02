/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const ls = require('ls-serialize');
const csvStringify = require('csv-stringify/lib/sync');
const csvParse = require('csv-parse/lib/sync');
const {readCues, parseCues} = require('./readCues');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_PATH = process.argv[3] || process.env.TLMC_PATH || '/mnt/TouhouBox/tlmc';
const LS_CACHE_PATH = path.join(__dirname, 'ls.cache');
const CUE_CACHE_PATH = path.join(__dirname, 'cue.cache');

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
  const cues = readCues(directory, TLMC_PATH);
  const songs = parseCues(cues);
  const songsString = csvStringify(songs, {header: true});
  // const cuesString = JSON.stringify(cues);
  fs.writeFileSync(CUE_CACHE_PATH, songsString);
}

{
  console.log('Checking file paths...');
  const songs = csvParse(fs.readFileSync(CUE_CACHE_PATH).toString());
  // const cues = JSON.parse(fs.readFileSync(CUE_CACHE_PATH).toString());
  let failed = songs.filter(song => {
    try {
      fs.accessSync(path.join(TLMC_PATH, song.path));
      return false;
    }
    catch (error) {
      return true;
    }
  });

  if (failed.length) {
    console.log(`${failed.length} songs not found:`);
    console.log(failed.map(fail => `- ${fail.path}`).join('\n'));
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
