const fs = require('fs')
const path = require('path')
const parse = require('./parse')

const TLMC_PATH = process.argv[2] || process.env.TLMC_PATH || '/mnt/tlmc'

console.log('Reading TLMC directory...')
const directory = parse.ls(TLMC_PATH)
const songs = parse.enumSongs(directory)

console.log('Checking file paths...')
const failed = songs.filter(song => {
  try {
    fs.accessSync(path.join(TLMC_PATH, song), fs.constants.R_OK)
    return false
  }
  catch (error) {
    return true
  }
})

if (failed.length) {
  console.log(`${failed.length} songs not found:`)
  console.log(failed.join('\n'))
}
else {
  console.log('All OK!')
}
