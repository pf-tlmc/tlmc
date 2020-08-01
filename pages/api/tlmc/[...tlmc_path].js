import http from 'http'
import { urlEncode } from '../../../src/utils'

const TLMC_SERVE = 'http://serve.tlmc.pf-n.co:3000/tlmc'

export default (req, res) => {
  const query = req.query.size === 'thumbnail' ? '?size=thumbnail' : ''
  return http.get(
    `${TLMC_SERVE}/${urlEncode(req.query.tlmc_path.join('/'))}${query}`,
    (httpRes) => {
      res.writeHead(httpRes.statusCode, httpRes.headers)
      httpRes.pipe(res)
    }
  )
}

export const config = {
  api: {
    externalResolver: true
  }
}
