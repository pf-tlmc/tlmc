import React from 'react'
import PropTypes from 'prop-types'
import { Directory, File } from 'ls-serialize/src/structures'
import FolderIcon from '@material-ui/icons/Folder'
import AudiotrackIcon from '@material-ui/icons/Audiotrack'
import AlbumIcon from '@material-ui/icons/Album'
import ImageIcon from '@material-ui/icons/Image'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import DescriptionIcon from '@material-ui/icons/Description'
import CodeIcon from '@material-ui/icons/Code'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'

const FileIcon = ({ file }) => {
  if (file.isDirectory) {
    return <FolderIcon />
  } else {
    switch (file.ext.toLowerCase()) {
      case '.mp3':
        return <AudiotrackIcon />
      case '.tta':
        return <AlbumIcon />
      case '.gif':
      case '.jpeg':
      case '.jpg':
      case '.png':
        return <ImageIcon />
      case '.pdf':
        return <PictureAsPdfIcon />
      case '.cue':
      case '.html':
      case '.log':
      case '.lrc':
      case '.txt':
        return <DescriptionIcon />
      case '.dll':
      case '.exe':
        return <CodeIcon />
      default:
        console.log('Unknown extension:', file.ext)
        return <InsertDriveFileIcon />
    }
  }
}

FileIcon.propTypes = {
  file: PropTypes.oneOfType([
    PropTypes.instanceOf(Directory).isRequired,
    PropTypes.instanceOf(File).isRequired
  ]).isRequired
}

export default FileIcon
