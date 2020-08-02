const fs = require('fs')
const path = require('path')
const http = require('http')

const CUE_URL = 'http://serve.tlmc.pf-n.co:3000/cue'
const CUE_CACHE_PATH = path.resolve(__dirname, '../.cache/cue')

module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.access(CUE_CACHE_PATH, (err) => {
      if (err) {
        console.log('Fetching CUE_CACHE...')
        http.get(CUE_URL, (res) => {
          const ls = fs.createWriteStream(CUE_CACHE_PATH)
          res.pipe(ls)
          ls.on('finish', () => {
            ls.close(() => {
              console.log('Fetched CUE_CACHE!')
              console.log()
              resolve()
            })
          })
        })
      } else {
        console.log('CUE_CACHE exists!')
        console.log()
        resolve()
      }
    })
  })
}
