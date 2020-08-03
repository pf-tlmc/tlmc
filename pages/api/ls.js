import fs from 'fs'

const LS_CACHE = './.cache/ls'

function ls (req, res) {
  fs.createReadStream(LS_CACHE).pipe(res)
}

export default ls
export const config = {
  api: {
    externalResolver: true
  }
}
