import React from 'react'
import PropTypes from 'prop-types'
import { File } from 'ls-serialize/src/structures'
import Typography from '@material-ui/core/Typography'
import AudioFileViewer from './AudioFileViewer'
import TextFileViewer from './TextFileViewer'
import PDFFileViewer from './PDFFileViewer'
import ImageFileViewer from './ImageFileViewer'

const FileViewer = ({ file }) => {
  switch (file.ext.toLowerCase()) {
    case '.mp3':
      return <AudioFileViewer file={file} />
    case '.gif':
    case '.jpeg':
    case '.jpg':
    case '.png':
      return <ImageFileViewer file={file} />
    case '.cue':
    case '.log':
    case '.lrc':
    case '.txt':
      return <TextFileViewer file={file} />
    case '.pdf':
      return <PDFFileViewer file={file} />
    default:
      return <Typography paragraph>There is no viewer for this file type yet.</Typography>
  }
}

FileViewer.propTypes = {
  file: PropTypes.instanceOf(File).isRequired
}

export default FileViewer
