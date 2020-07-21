const Index = () => {
  return null
}

Index.getInitialProps = ({ res, req }) => {
  if (res) {
    const { url } = req
    res.writeHead(301, { Location: url === '/' ? '/tlmc' : '/tlmc' + url })
    res.end()
  }

  return {}
}

export default Index
