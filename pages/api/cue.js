import fs from 'fs'

const CUE_CACHE = './.cache/cue'

function cue (req, res) {
  fs.createReadStream(CUE_CACHE).pipe(res)
}

export default cue
export const config = {
  api: {
    externalResolver: true
  }
}
