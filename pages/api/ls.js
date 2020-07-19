import http from 'http'

const LS_URL = 'http://home.pf-n.co:3000/ls'

export default (req, res) => {
  return http.get(LS_URL, (httpRes) => httpRes.pipe(res))
}

export const config = {
  api: {
    externalResolver: true
  }
}
