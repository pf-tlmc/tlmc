import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Container from './Container'
import TextFileViewer from './TextFileViewer'
import ImageFileViewer from './ImageFileViewer'

const FileViewer = ({ file }) => {
  switch (file.ext.toLowerCase()) {
    case '.jpg':
    case '.png':
      return <ImageFileViewer file={file} />
    case '.cue':
    case '.txt':
      return <TextFileViewer file={file} />
    default:
      return (
        <Container title={file.base}>
          <Typography paragraph>There is no viewer for this file type yet.</Typography>
        </Container>
      )
  }
}

FileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default FileViewer
