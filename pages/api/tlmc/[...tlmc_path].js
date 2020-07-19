import http from 'http'

const TLMC_SERVE = 'http://home.pf-n.co:3000/tlmc'

export default (req, res) => {
  return http.get(`${TLMC_SERVE}/${req.query.tlmc_path.join('/')}`, (httpRes) => httpRes.pipe(res))
}

export const config = {
  api: {
    externalResolver: true
  }
}
