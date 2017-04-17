const fs = require('fs')
const path = require('path')
const cueParser = require('cue-parser')

function ls(dirPath, dirName = path.sep) {
  const files = []
  const cues = []

  fs.readdirSync(dirPath).forEach(fileName => {
    const filePath = path.join(dirPath, fileName)
    const fileStat = fs.statSync(filePath)

    if (fileStat.isDirectory()) {
      files.push(ls(filePath, fileName))
    }

    else if (fileStat.isFile()) {
      if (path.extname(fileName) === '.cue') {
        try {
          cues.push(cueParser.parse(filePath))
        }
        catch (error) {
          throw new TypeError(`could not parse ${filePath}`)
        }
      }
      files.push(fileName)
    }

    else {
      throw new TypeError(`unknown file type found: ${filePath}`)
    }
  })

  return cues.length
    ? {name: dirName, files, cues}
    : {name: dirName, files}
}

function formatTrack(track) {
  return `${('00' + track.number).slice(-2)}. ${track.title}.mp3`
}

function enumSongs(dir) {
  const songs = []

  function _enum(dir, dirPath) {
    if (dir.cues) {
      for (const cue of dir.cues) {
        for (const file of cue.files) {
          for (const track of file.tracks) {
            songs.push(path.join(dirPath, formatTrack(track)))
          }
        }
      }
    }

    for (const file of dir.files) {
      if (typeof file === 'object') {
        _enum(file, path.join(dirPath, file.name))
      }
    }
  }

  _enum(dir, '')
  return songs
}

module.exports = {ls, enumSongs}
