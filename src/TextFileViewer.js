import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

async function fetchFile ({ file }) {
  const res = await fetch('/api/tlmc' + file.path)
  return res.text()
}

const TextFileViewer = ({ file }) => {
  const { data, error, isPending } = useAsync(fetchFile, { file })

  return (
    <Container>
      <Typography variant='h5'>{file.base}</Typography>
      {isPending && 'pending'}
      {error && JSON.stringify(error)}
      {data && <pre><code>{data}</code></pre>}
    </Container>
  )
}

TextFileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default TextFileViewer
