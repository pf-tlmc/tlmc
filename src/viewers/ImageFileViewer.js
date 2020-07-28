import React from 'react'
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
      <img src={'/api/tlmc' + urlEncode(file.path)} className={classes.image} />
    </Box>
  )
}

export default ImageFileViewer
