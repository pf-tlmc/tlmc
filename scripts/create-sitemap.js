const fs = require('fs')
const path = require('path')
const lsSerialize = require('ls-serialize')

const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml')
const LS_CACHE_PATH = path.resolve(__dirname, '../.cache/ls')
const PAGES = ['about', 'search']

function urlEncode (url) {
  return url.split('/').map(encodeURIComponent).join('/')
}

module.exports = () =>
  new Promise((resolve, reject) => {
    fs.access(SITEMAP_PATH, (err) => {
      if (err) {
        console.log('Generating sitemap...')
        fs.writeFileSync(SITEMAP_PATH, '')

        const root = lsSerialize.deserialize(fs.readFileSync(LS_CACHE_PATH).toString())
        fs.appendFileSync(SITEMAP_PATH,
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        )

        for (const page of PAGES) {
          fs.appendFileSync(SITEMAP_PATH,
            `  <url><loc>https://tlmc.pf-n.co/${page}</loc></url>\n`
          )
        }

        ;(function processDirectory (directory = root) {
          for (const file of directory) {
            fs.appendFileSync(SITEMAP_PATH,
              `  <url><loc>https://tlmc.pf-n.co/tlmc${urlEncode(file.path)}</loc></url>\n`
            )
            if (file.isDirectory) {
              processDirectory(file)
            }
          }
        })()

        fs.appendFileSync(SITEMAP_PATH, '</urlset>\n')
        console.log('Generated sitemap!')
        console.log()
        resolve()
      } else {
        console.log('Sitemap exists!')
        console.log()
        resolve()
      }
    })
  })
