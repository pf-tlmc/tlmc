const fs = require('fs')
const path = require('path')
const cueParser = require('cue-parser')

const TLMC_PATH = process.env.TLMC_PATH || '/mnt/tlmc'

function pad(num) {
  return ('0' + num).slice(-2)
}

class Directory {
  constructor(name) {
    this._fileNames = []
    this._files = {}
    this._name = name
    this._parent = null
  }

  get files() { return this._fileNames }
  get length() { return this._fileNames.length }
  get name() { return this._name }
  get parent() { return this._parent }
  get path() {
    return this._parent
      ? path.join(this._parent.path, this._name)
      : this._name
  }

  get(name) {
    return this._files[name]
  }
  getIndex(index) {
    return this._files[this._fileNames[index]]
  }

  add(file) {
    if (!(file instanceof Directory) && !(file instanceof File)) {
      throw new TypeError('tried to add something that was not a Directory or File')
    }
    if (file._parent) {
      throw new TypeError('file already has a parent Directory')
    }
    this._fileNames.push(file.name)
    this._files[file.name] = file
    file._parent = this
  }

  [Symbol.iterator]() {
    let index = -1
    let fileNames = this._fileNames
    let files = this._files

    return {
      next() {
        return ++index < fileNames.length
          ? {done: false, value: files[fileNames[index]]}
          : {done: true, value: undefined}
      }
    }
  }
}

class File {
  constructor(name) {
    this._name = name
    this._parent = null
  }

  get name() { return this._name }
  get parent() { return this._parent }
  get path() {
    return this._parent
      ? path.join(this._parent.path, this._name)
      : this._name
  }
}

class MusicFile extends File {
  constructor(name, cueSheet, track) {
    super(name)
    this._cueSheet = cueSheet
    this._track = track
  }

  get cueSheet() { return this._cueSheet }
  get track() { return this._track }
}

function parseDirectory(name, _path, _music) {
  const directory = new Directory(name)
  const fileNames = fs.readdirSync(_path)

  let cueSheet = fileNames.find(name => path.extname(name) === '.cue')
  let cueTracks
  if (cueSheet) {
    cueSheet = cueParser.parse(path.join(_path, cueSheet))
    cueTracks = {}
    for (const file of cueSheet.files) {
      for (const track of file.tracks) {
        cueTracks[`${pad(track.number)}. ${track.title}.mp3`] = track
      }
    }
  }

  for (const name of fileNames) {
    const stat = fs.statSync(path.join(_path, name))

    if (stat.isDirectory()) {
      directory.add(parseDirectory(name, path.join(_path, name)))
    }

    else if (stat.isFile()) {
      if (cueTracks && cueTracks[name]) {
        const music = new MusicFile(name, cueSheet, cueTracks[name])
        directory.add(music)
        _music.push(music)
      }
      else {
        directory.add(new File(name))
      }
    }

    else {
      throw new TypeError(`Unknown file type found: ${path.join(_path, name)}`)
    }
  }

  return directory
}

module.exports = function parse(tlmcPath = TLMC_PATH) {
  const tracks = []
  return {
    tlmc: parseDirectory(tlmcPath, tlmcPath, []),
    tracks
  }
}
