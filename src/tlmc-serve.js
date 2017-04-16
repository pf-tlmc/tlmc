const fs = require('fs')
const path = require('path')
const parse = require('./parse')

const TLMC_PATH = process.env.TLMC_PATH || '/mnt/tlmc'

console.log('Reading TLMC directory...')
const directory = parse.ls(TLMC_PATH)
const songs = parse.enumSongs(directory)

console.log('Checking file paths...')
for (const song of songs) {
  fs.accessSync(path.join(TLMC_PATH, song), fs.constants.W_OK)
}

console.log('All OK!')
