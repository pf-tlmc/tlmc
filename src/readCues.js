const path = require('path');
const sanitizeFilename = require('sanitize-filename');
const cueParser = require('cue-parser');
const {File, Directory} = require('ls-serialize');

const SANITIZE_MAP = [
  ['/', '-'],
  ['\\', '-'],
  ['?', ''],
  ['*', 'x'],
  [':', '-'],
  ['|', '-'],
  ['<', '_'],
  ['>', '_'],
  ['\t', '_']
];

function readCues(root, rootPath) {
  const cues = [];

  function _readCues(currFile) {
    if (currFile instanceof File && currFile.ext.toLowerCase() === '.cue') {
      const cue = cueParser.parse(rootPath + currFile.path);
      cue.dir = currFile.dir;
      cues.push(cue);
    }

    else if (currFile instanceof Directory) {
      Array.from(currFile.files)
        .sort((a, b) => a.base.localeCompare(b.base))
        .forEach(_readCues);
    }
  }

  _readCues(root);
  return cues;
}

function parseCues(cues) {
  const songs = [];

  for (const cue of cues) {
    for (const file of cue.files) {
      for (const track of file.tracks) {
        const number = ('00' + track.number).slice(-2);
        const title = track.title
          ? sanitizeFilename(track.title, SANITIZE_MAP)
          : path.parse(file.name).name;
        songs.push({
          path: path.join(cue.dir, `${number}. ${title}.mp3`),
          cuePerformer: cue.performer,
          cueSongwriter: cue.songWriter,
          cueTitle: cue.title,
          number: track.number,
          title: track.title,
          performer: track.performer,
          songWriter: track.songWriter
        });
      }
    }
  }

  return songs;
}

module.exports = {
  readCues,
  parseCues
};
