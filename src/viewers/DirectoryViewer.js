import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import FileIcon from '../FileIcon'
import Link from '../Link'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  list: {
    padding: 0
  },
  listItem: {
    padding: theme.spacing(0.5, 4)
  },
  listIcon: {
    color: 'inherit'
  }
}))

const DirectoryViewer = ({ directory, filter, onSelect = () => {} }) => {
  const files = Array.isArray(directory) ? directory : [...directory.files]
  const filteredFiles = filter ? files.filter(filter) : files
  const classes = useStyles()

  return (
    <List className={classes.list}>
      {filteredFiles.map((file, index) =>
        <Link key={index} href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(file.path)} underline='none'>
          <ListItem button className={classes.listItem} onClick={onSelect}>
            <ListItemIcon className={classes.listIcon}><FileIcon file={file} /></ListItemIcon>
            <ListItemText><Typography>{file.base}</Typography></ListItemText>
          </ListItem>
        </Link>)}
    </List>
  )
}

export default DirectoryViewer
