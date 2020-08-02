import fs from 'fs'

const CUE_CACHE = './.cache/cue'

export default (req, res) => {
  fs.createReadStream(CUE_CACHE).pipe(res)
}

export const config = {
  api: {
    externalResolver: true
  }
}
