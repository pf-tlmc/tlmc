import React from 'react'
import PropTypes from 'prop-types'
import { File } from 'ls-serialize/src/structures'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  image: {
    maxWidth: '100%'
  }
}))

const ImageFileViewer = ({ file }) => {
  const classes = useStyles()

  return (
    <Box textAlign='center'>
      <img src={`/api/tlmc${urlEncode(file.path)}`} className={classes.image} />
    </Box>
  )
}

ImageFileViewer.propTypes = {
  file: PropTypes.instanceOf(File).isRequired
}

export default ImageFileViewer
