import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from './Container'

const useStyles = makeStyles((theme) => ({
  loading: {
    width: '100%',
    textAlign: 'center',
    padding: theme.spacing(4, 0)
  }
}))

async function fetchFile ({ file }) {
  const res = await fetch('/api/tlmc' + file.path)
  return res.text()
}

const TextFileViewer = ({ file }) => {
  const { data, error, isPending } = useAsync(fetchFile, { file })
  const classes = useStyles()

  return (
    <Container title={file.base}>
      {isPending && <div className={classes.loading}><CircularProgress /></div>}
      {error && JSON.stringify(error)}
      {data && <pre><code>{data}</code></pre>}
    </Container>
  )
}

TextFileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default TextFileViewer
