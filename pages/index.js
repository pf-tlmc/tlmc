const Index = () => {
  return null
}

Index.getInitialProps = ({ res }) => {
  if (res) {
    res.writeHead(301, { Location: '/tlmc' })
    res.end()
  }

  return {}
}

export default Index
