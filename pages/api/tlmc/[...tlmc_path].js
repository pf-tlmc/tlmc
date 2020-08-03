import http from 'http'
import { urlEncode } from '../../../src/utils'

export default (req, res) => {
  return http.get(
    `${process.env.TLMC_SERVE}/tlmc${urlEncode(req.query.tlmc_path.join('/'))}`,
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
