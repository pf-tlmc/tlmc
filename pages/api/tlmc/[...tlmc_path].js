import http from 'http'

const TLMC_SERVE = 'http://home.pf-n.co:3000/tlmc'

export default (req, res) => {
  const query = req.query.size === 'thumbnail' ? '?size=thumbnail' : ''
  return http.get(
    `${TLMC_SERVE}/${req.query.tlmc_path.join('/')}${query}`,
    (httpRes) => httpRes.pipe(res)
  )
}

export const config = {
  api: {
    externalResolver: true
  }
}
