const Index = () => {
  return null
}

Index.getInitialProps = ({ res, req }) => {
  if (res) {
    res.writeHead(301, { Location: '/tlmc' + req.url })
    res.end()
  }

  return {}
}

export default Index
