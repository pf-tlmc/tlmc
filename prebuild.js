const getLs = require('./scripts/get-ls')
const createSitemap = require('./scripts/create-sitemap')

;(async () => {
  await getLs()
  await createSitemap()
})()
