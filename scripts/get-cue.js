const fs = require('fs')
const path = require('path')
const http = require('http')

const CUE_CACHE_PATH = path.resolve(__dirname, '../.cache/cue')

module.exports = () => {
  if (!fs.existsSync(path.resolve(__dirname, '../.cache'))) {
    fs.mkdirSync(path.resolve(__dirname, '../.cache'))
  }

  return new Promise((resolve, reject) => {
    fs.access(CUE_CACHE_PATH, (err) => {
      if (err) {
        console.log('Fetching CUE_CACHE...')
        http.get(`${process.env.TLMC_SERVE}/cue`, (res) => {
          const cue = fs.createWriteStream(CUE_CACHE_PATH)
          res.pipe(cue)
          cue.on('finish', () => {
            cue.close(() => {
              console.log('Fetched CUE_CACHE!')
              console.log()
              resolve()
            })
          })
          cue.on('error', (err) => { reject(err) })
        })
      } else {
        console.log('CUE_CACHE exists!')
        console.log()
        resolve()
      }
    })
  })
}
