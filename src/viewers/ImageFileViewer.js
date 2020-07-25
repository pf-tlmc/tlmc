import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '../Container'
import urlEncode from '../urlEncode'

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    textAlign: 'center'
  },
  image: {
    maxWidth: '100%'
  }
}))

const ImageFileViewer = ({ file }) => {
  const classes = useStyles()

  return (
    <Container title={file.base}>
      <div className={classes.imageContainer}>
        <img src={'/api/tlmc' + urlEncode(file.path)} className={classes.image} />
      </div>
    </Container>
  )
}

export default ImageFileViewer
