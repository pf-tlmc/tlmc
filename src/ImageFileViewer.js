import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

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
    <Container>
      <Typography variant='h5' gutterBottom>{file.base}</Typography>
      <div className={classes.imageContainer}>
        <img src={'/api/tlmc' + file.path} className={classes.image} />
      </div>
    </Container>
  )
}

ImageFileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default ImageFileViewer
