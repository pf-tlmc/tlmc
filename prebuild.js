const getLs = require('./scripts/get-ls')
const getCue = require('./scripts/get-cue')
const createSitemap = require('./scripts/create-sitemap')

;(async () => {
  try {
    await getLs()
    await getCue()
    await createSitemap()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
