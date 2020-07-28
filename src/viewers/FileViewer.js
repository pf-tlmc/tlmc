import React from 'react'
import Typography from '@material-ui/core/Typography'
import Mp3FileViewer from './Mp3FileViewer'
import TextFileViewer from './TextFileViewer'
import PDFFileViewer from './PDFFileViewer'
import ImageFileViewer from './ImageFileViewer'

const FileViewer = ({ file }) => {
  switch (file.ext.toLowerCase()) {
    case '.mp3':
      return <Mp3FileViewer file={file} />
    case '.jpg':
    case '.gif':
    case '.png':
      return <ImageFileViewer file={file} />
    case '.cue':
    case '.txt':
    case '.log':
      return <TextFileViewer file={file} />
    case '.pdf':
      return <PDFFileViewer file={file} />
    default:
      return <Typography paragraph>There is no viewer for this file type yet.</Typography>
  }
}

export default FileViewer
