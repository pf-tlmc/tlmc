import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'unfetch'
import { File } from 'ls-serialize/src/structures'
import { useAsync } from 'react-async'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Code from '../components/Code'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  loading: {
    width: '100%',
    textAlign: 'center',
    padding: theme.spacing(4, 0)
  }
}))

async function fetchFile ({ file }) {
  const res = await fetch(`/api/tlmc${urlEncode(file.path)}`)
  return res.text()
}

const TextFileViewer = ({ file }) => {
  const { data, error, isPending } = useAsync(fetchFile, { file })
  const classes = useStyles()

  if (isPending) {
    return <div className={classes.loading}><CircularProgress /></div>
  } else if (error) {
    return 'Error'
  } else {
    return <Code>{data}</Code>
  }
}

TextFileViewer.propTypes = {
  file: PropTypes.instanceOf(File).isRequired
}

export default TextFileViewer
