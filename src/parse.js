const fs = require('fs')
const path = require('path')
const cueParser = require('cue-parser')

const TLMC_PATH = process.env.TLMC_PATH || '/mnt/tlmc'

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
      ? path.join(this._parent, this._name)
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
    if (file.parent) {
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
      ? path.join(this._parent, this._name)
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

function parseDirectory(name, parent) {
  const directory = new Directory(name)
  if (parent) {
    parent.add(directory)
  }

  const fileNames = fs.readdirSync(directory.path)
  const cueSheet = fileNames.find(name => path.extname(name) === '.cue')
  if (cueSheet)
    console.log('CUE FOUND')

  for (const name of fileNames) {
    const stat = fs.statSync(path.join(directory.path, name))

    if (stat.isDirectory()) {
      directory.add(parseDirectory(name, directory))
    }
    else if (stat.isFile()) {
      directory.add(new File(name))
    }
    else {
      console.log(`Unknown file type found: ${path.join(directory.path, name)}`)
    }
  }

  return directory
}

module.exports = function parse(tlmcPath = TLMC_PATH) {
  return parseDirectory(tlmcPath, null)
}
