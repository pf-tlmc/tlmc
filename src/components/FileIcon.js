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
import ArchiveIcon from '@material-ui/icons/Archive'
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
      case '.jpg':
      case '.gif':
      case '.png':
        return <ImageIcon />
      case '.pdf':
        return <PictureAsPdfIcon />
      case '.cue':
      case '.txt':
      case '.log':
      case '.html':
        return <DescriptionIcon />
      case '.exe':
      case '.dll':
        return <CodeIcon />
      case '.7z':
        return <ArchiveIcon />
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
