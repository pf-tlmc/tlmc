const fs = require('fs')
const path = require('path')
const cueParser = require('cue-parser')

const TLMC_PATH = process.env.TLMC_PATH || '/mnt/tlmc/'

function assignDir(obj, key, val) {
  obj._files.push(key)
  obj[key] = val
}

module.exports = function tlmc(tlmcPath = TLMC_PATH) {
  function parseDirectory(dirPath, parent) {
    const parsed = {_files: [], _parent: parent}
    let cueSheet

    for (const fileName of fs.readdirSync(dirPath)) {
      const filePath = path.join(dirPath, fileName)
      const fileStat = fs.statSync(filePath)

      if (fileStat.isDirectory()) {
        assignDir(parsed, fileName, parseDirectory(filePath, parsed))
      }

      else if (fileStat.isFile()) {
        const ext = path.extname(fileName)
        if (ext === '.cue')
          cueSheet = filePath

        assignDir(parsed, fileName, {_parent: parsed, fileName})
      }

      else {
        console.log(`Unknown file type found: ${filePath}`)
      }
    }

    if (cueSheet) {
      console.log(cueParser.parse(cueSheet))
    }

    return parsed
  }

  return parseDirectory(tlmcPath, null)
}
