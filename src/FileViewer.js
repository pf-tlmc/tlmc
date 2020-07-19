import React from 'react'
import PropTypes from 'prop-types'

const FileViewer = ({ file }) => {
  return (
    <div>This file is {file.path}</div>
  )
}

FileViewer.propTypes = {
  file: PropTypes.object.isRequired
}

export default FileViewer
