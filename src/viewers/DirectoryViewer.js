import React from 'react'
import PropTypes from 'prop-types'
import { Directory, File } from 'ls-serialize/src/structures'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import FileIcon from '../components/FileIcon'
import Link from '../components/Link'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0
  },
  listItem: {
    padding: theme.spacing(0.5, 2)
  },
  listIcon: {
    color: 'inherit'
  }
}))

const DirectoryViewer = ({ directory, filter }) => {
  const classes = useStyles()
  const files = Array.isArray(directory) ? directory : [...directory.files]
  const filteredFiles = filter ? files.filter(filter) : files

  return (
    <List className={classes.root}>
      {filteredFiles.map((file, index) =>
        <Link key={index} href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(file.path)} underline='none'>
          <ListItem button className={classes.listItem}>
            <ListItemIcon className={classes.listIcon}><FileIcon file={file} /></ListItemIcon>
            <ListItemText><Typography>{file.base}</Typography></ListItemText>
          </ListItem>
        </Link>)}
    </List>
  )
}

DirectoryViewer.propTypes = {
  directory: PropTypes.oneOfType([
    PropTypes.instanceOf(Directory).isRequired,
    PropTypes.arrayOf(PropTypes.instanceOf(File).isRequired).isRequired
  ]).isRequired,
  filter: PropTypes.func
}

export default DirectoryViewer
