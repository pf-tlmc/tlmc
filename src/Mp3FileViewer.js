import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from './Container'
import urlEncode from './urlEncode'

const useStyles = makeStyles((theme) => ({
  audio: {
    width: '100%',
    margin: theme.spacing(2, 0)
  }
}))

const Mp3FileViewer = ({ file }) => {
  const classes = useStyles()

  return (
    <Container title={file.base}>
      <audio controls className={classes.audio}>
        <source src={'/api/tlmc' + urlEncode(file.path)} type='audio/mpeg' />
      </audio>
    </Container>
  )
}

Mp3FileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default Mp3FileViewer
