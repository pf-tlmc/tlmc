const fs = require('fs')
const path = require('path')
const lsSerialize = require('ls-serialize')

const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml')
const SITEMAPS_DIR = path.resolve(__dirname, '../public/sitemaps')
const LS_CACHE_PATH = path.resolve(__dirname, '../.cache/ls')
const PAGES = ['about', 'search']

function urlEncode (url) {
  return url
    .replace(/#/g, '%23')
    .replace(/&/g, '%26')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/"/g, '%22')
}

function processDirectory (directory, path) {
  for (const file of directory) {
    fs.appendFileSync(path,
      `  <url><loc>https://tlmc.pf-n.co/tlmc${urlEncode(file.path)}</loc></url>\n`
    )
    if (file.isDirectory) {
      processDirectory(file, path)
    }
  }
}

module.exports = () =>
  new Promise((resolve, reject) => {
    fs.access(SITEMAP_PATH, (err) => {
      if (err) {
        console.log('Generating sitemap...')
        if (!fs.existsSync(SITEMAPS_DIR)) {
          fs.mkdirSync(SITEMAPS_DIR)
        }
        const ROOT_SITEMAP = path.resolve(SITEMAPS_DIR, './tlmc.xml')

        const root = lsSerialize.deserialize(fs.readFileSync(LS_CACHE_PATH).toString())
        fs.writeFileSync(SITEMAP_PATH,
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<sitemapindex xmlns="http://www.google.com/schemas/sitemap/0.84">\n'
        )
        fs.writeFileSync(ROOT_SITEMAP,
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        )

        fs.appendFileSync(SITEMAP_PATH,
          '  <sitemap><loc>https://tlmc.pf-n.co/sitemaps/tlmc.xml</loc></sitemap>\n'
        )

        for (const page of PAGES) {
          fs.appendFileSync(ROOT_SITEMAP,
            `  <url><loc>https://tlmc.pf-n.co/${page}</loc></url>\n`
          )
        }

        for (const file of root) {
          if (file.isFile) {
            fs.appendFileSync(ROOT_SITEMAP,
              `  <url><loc>https://tlmc.pf-n.co/tlmc${urlEncode(file.path)}</loc></url>\n`
            )
          } else {
            const fileName = `${urlEncode(file.base)}.xml`
            const filePath = path.resolve(SITEMAPS_DIR, `./${fileName}`)

            fs.appendFileSync(SITEMAP_PATH,
              `  <sitemap><loc>https://tlmc.pf-n.co/sitemaps/${fileName}</loc></sitemap>\n`
            )

            fs.writeFileSync(filePath,
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            )
            processDirectory(file, filePath)
            fs.appendFileSync(filePath, '</urlset>\n')
          }
        }

        fs.appendFileSync(ROOT_SITEMAP, '</urlset>\n')
        fs.appendFileSync(SITEMAP_PATH, '</sitemapindex>\n')

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
