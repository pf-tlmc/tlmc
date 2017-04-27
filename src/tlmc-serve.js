/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const express = require('express');
// const compression = require('compression');
const ls = require('ls-serialize');

const PORT = process.argv[2] || process.env.TLMC_PORT || 80;
const TLMC_PATH = process.argv[3] || process.env.TLMC_PATH || '/mnt/TouhouBox/tlmc';
const LS_CACHE_PATH = path.join(__dirname, 'ls.cache');

/* eslint-disable no-console */
try {
  fs.accessSync(LS_CACHE_PATH);
  console.log('ls-cache found. Reading from cache.');
}

catch (err) {
  console.log('No ls-cache found. Creating directory structure...');
  const directoryString = ls.serialize(TLMC_PATH);
  fs.writeFileSync(LS_CACHE_PATH, directoryString);
}

// console.log('Checking file paths...');
// let failed = songs.filter(song => {
//   try {
//     fs.accessSync(path.join(TLMC_PATH, song), fs.constants.R_OK);
//     return false;
//   }
//   catch (error) {
//     return true;
//   }
// });
//
// if (failed.length) {
//   console.log(`${failed.length} songs not found:`);
//   console.log(failed.join('\n'));
// }
// else {
//   console.log('All OK!');
// }
//
// songs = undefined;
// failed = undefined;

const app = express();

// app.use(compression({level: 9}));

app.use('/tlmc', express.static(TLMC_PATH));

app.get('/ls', (req, res) => {
  res.sendFile(LS_CACHE_PATH);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
