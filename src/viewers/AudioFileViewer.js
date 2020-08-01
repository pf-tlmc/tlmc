import React from 'react'
import PropTypes from 'prop-types'
import { File } from 'ls-serialize/src/structures'
import { makeStyles } from '@material-ui/core/styles'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  audio: {
    width: '100%',
    margin: theme.spacing(2, 0)
  }
}))

const AudioFileViewer = ({ file }) => {
  const classes = useStyles()

  return (
    <audio controls className={classes.audio}>
      <source src={`/api/tlmc${urlEncode(file.path)}`} type='audio/mpeg' />
    </audio>
  )
}

AudioFileViewer.propTypes = {
  file: PropTypes.instanceOf(File).isRequired
}

export default AudioFileViewer
