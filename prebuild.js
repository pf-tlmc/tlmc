const getLs = require('./scripts/get-ls')
const getCue = require('./scripts/get-cue')
const createSitemap = require('./scripts/create-sitemap')

;(async () => {
  await getLs()
  await getCue()
  await createSitemap()
})()
