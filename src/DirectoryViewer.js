import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Link from './Link'
import FileIcon from './FileIcon'

const DirectoryViewer = ({ directory }) => {
  return (
    <List dense>
      {[...directory.files].map((file, index) =>
        <Link key={index} href='/tlmc/[...tlmc_path]' as={'/tlmc' + file.path}>
          <ListItem button>
            <ListItemIcon><FileIcon file={file} /></ListItemIcon>
            <ListItemText>{file.base}</ListItemText>
          </ListItem>
        </Link>
      )}
    </List>
  )
}

DirectoryViewer.propTypes = {
  directory: PropTypes.object.isRequired
}

export default DirectoryViewer
