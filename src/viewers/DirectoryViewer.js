import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import DirectoryViewerVirtualized from './DirectoryViewerVirtualized'
import FileIcon from '../FileIcon'
import Link from '../Link'
import urlEncode from '../urlEncode'

const useStyles = makeStyles((theme) => ({
  list: {
    padding: ({ disablePadding }) => disablePadding ? 0 : theme.spacing(1, 0, 20)
  },
  listItem: {
    padding: theme.spacing(0.5, 4)
  },
  listIcon: {
    color: 'inherit'
  }
}))

const DirectoryViewer = ({ directory, disablePadding, onSelect = () => {} }) => {
  if (directory.isRoot) {
    return (
      <DirectoryViewerVirtualized
        directory={directory}
        filter={(file) => file.isDirectory}
      />
    )
  }

  const files = Array.isArray(directory) ? directory : [...directory.files]
  const classes = useStyles({ disablePadding })

  return (
    <List className={classes.list}>
      {files.map((file, index) =>
        <Link key={index} href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(file.path)}>
          <ListItem button className={classes.listItem} onClick={onSelect}>
            <ListItemIcon className={classes.listIcon}><FileIcon file={file} /></ListItemIcon>
            <ListItemText><Typography>{file.base}</Typography></ListItemText>
          </ListItem>
        </Link>)}
    </List>
  )
}

export default DirectoryViewer
