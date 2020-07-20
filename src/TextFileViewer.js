import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import Container from './Container'

async function fetchFile ({ file }) {
  const res = await fetch('/api/tlmc' + file.path)
  return res.text()
}

const TextFileViewer = ({ file }) => {
  const { data, error, isPending } = useAsync(fetchFile, { file })

  return (
    <Container title={file.base}>
      {isPending && 'Loading...'}
      {error && JSON.stringify(error)}
      {data && <pre><code>{data}</code></pre>}
    </Container>
  )
}

TextFileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default TextFileViewer
