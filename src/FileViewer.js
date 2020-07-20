import React from 'react'
import PropTypes from 'prop-types'
import TextFileViewer from './TextFileViewer'
import ImageFileViewer from './ImageFileViewer'

const FileViewer = ({ file }) => {
  switch (file.ext.toLowerCase()) {
    case '.jpg':
    case '.png':
      return <ImageFileViewer file={file} />
    case '.cue':
    case '.txt':
    default:
      return <TextFileViewer file={file} />
  }
}

FileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default FileViewer
