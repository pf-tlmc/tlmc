import fs from 'fs'

const LS_CACHE = './.cache/ls'

export default (req, res) => {
  fs.createReadStream(LS_CACHE).pipe(res)
}

export const config = {
  api: {
    externalResolver: true
  }
}
