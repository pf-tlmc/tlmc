import fetch from 'isomorphic-fetch'

const LS_URL = 'http://home.pf-n.co:3000/ls'

export default (req, res) => {
  return fetch(LS_URL)
    .then((fetchRes) => {
      res.status(200).send(fetchRes.body)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Error')
    })
}
