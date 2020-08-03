const fs = require('fs')
const path = require('path')
const http = require('http')

const LS_CACHE_PATH = path.resolve(__dirname, '../.cache/ls')

module.exports = () => {
  if (!fs.existsSync(path.resolve(__dirname, '../.cache'))) {
    fs.mkdirSync(path.resolve(__dirname, '../.cache'))
  }

  return new Promise((resolve, reject) => {
    fs.access(LS_CACHE_PATH, (err) => {
      if (err) {
        console.log('Fetching LS_CACHE...')
        http.get(`${process.env.TLMC_SERVE}/ls`, (res) => {
          const ls = fs.createWriteStream(LS_CACHE_PATH)
          res.pipe(ls)
          ls.on('finish', () => {
            ls.close(() => {
              console.log('Fetched LS_CACHE!')
              console.log()
              resolve()
            })
          })
          ls.on('error', (err) => { reject(err) })
        })
      } else {
        console.log('LS_CACHE exists!')
        console.log()
        resolve()
      }
    })
  })
}
