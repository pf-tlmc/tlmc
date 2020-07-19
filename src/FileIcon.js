import React from 'react'
import PropTypes from 'prop-types'
import { Directory } from 'ls-serialize/src/structures'
import FolderIcon from '@material-ui/icons/Folder'
import AudiotrackIcon from '@material-ui/icons/Audiotrack'
import AlbumIcon from '@material-ui/icons/Album'
import ImageIcon from '@material-ui/icons/Image'
import DescriptionIcon from '@material-ui/icons/Description'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'

const FileIcon = ({ file }) => {
  if (file instanceof Directory) {
    return <FolderIcon />
  } else {
    switch (file.ext.toLowerCase()) {
      case '.mp3':
        return <AudiotrackIcon />
      case '.tta':
        return <AlbumIcon />
      case '.jpg':
        return <ImageIcon />
      case '.cue':
      case '.txt':
        return <DescriptionIcon />
      default:
        console.log('Unknown extension:', file.ext)
        return <InsertDriveFileIcon />
    }
  }
}

FileIcon.propTypes = {
  file: PropTypes.object.isRequired
}

export default FileIcon
