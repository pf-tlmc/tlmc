import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Directory, File } from 'ls-serialize/src/structures'
import Container from '@material-ui/core/Container'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from '../components/Link'
import FileIcon from '../components/FileIcon'
import { urlEncode } from '../utils'

// These values should match the ones defined in DirectoryViewer and Page
const TITLE_SIZE = 50
const ITEM_SIZE = 43
const PADDING_TOP = 8
const PADDING_BOTTOM = 8

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(0.5, 2)
  },
  listIcon: {
    color: 'inherit'
  }
}))

const paddedList = forwardRef(({ style, children }, ref) => {
  style.height = `${parseFloat(style.height) + PADDING_TOP + PADDING_BOTTOM}px`
  return <div ref={ref} style={style}>{children}</div>
})

const DirectoryViewerVirtualized = ({ contained, title, directory, filter }) => {
  const classes = useStyles()
  const files = Array.isArray(directory) ? directory : [...directory.files]
  const filteredFiles = filter ? files.filter(filter) : files

  const renderRow = ({ index, style }) => {
    const adjustedStyle = {
      ...style,
      top: `${parseFloat(style.top) + PADDING_TOP}px`
    }

    if (title && index === 0) {
      return (
        <div style={adjustedStyle}>
          {contained ? (
            <Container>
              <ListItem className={classes.listItem}>
                <ListItemText><Typography variant='h5' noWrap>{title}</Typography></ListItemText>
              </ListItem>
            </Container>
          ) : (
            <ListItem className={classes.listItem}>
              <ListItemText><Typography variant='h5' noWrap>{title}</Typography></ListItemText>
            </ListItem>
          )}
        </div>
      )
    }

    const file = filteredFiles[title ? index - 1 : index]
    return (
      <Link href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(file.path)} underline='none'>
        <div style={adjustedStyle}>
          {contained ? (
            <Container>
              <ListItem button className={classes.listItem}>
                <ListItemIcon className={classes.listIcon}><FileIcon file={file} /></ListItemIcon>
                <ListItemText><Typography noWrap>{file.base}</Typography></ListItemText>
              </ListItem>
            </Container>
          ) : (
            <ListItem button className={classes.listItem}>
              <ListItemIcon className={classes.listIcon}><FileIcon file={file} /></ListItemIcon>
              <ListItemText><Typography noWrap>{file.base}</Typography></ListItemText>
            </ListItem>
          )}
        </div>
      </Link>
    )
  }

  return (
    <AutoSizer>
      {({ width, height }) =>
        <List
          width={width}
          height={height}
          innerElementType={paddedList}
          itemCount={title ? filteredFiles.length + 1 : filteredFiles.length}
          itemSize={(index) => title && index === 0 ? TITLE_SIZE : ITEM_SIZE}
          overscanCount={10}
        >
          {renderRow}
        </List>}
    </AutoSizer>
  )
}

DirectoryViewerVirtualized.propTypes = {
  contained: PropTypes.bool,
  title: PropTypes.string,
  directory: PropTypes.oneOfType([
    PropTypes.instanceOf(Directory).isRequired,
    PropTypes.arrayOf(
      PropTypes.oneOf([
        PropTypes.instanceOf(File).isRequired,
        PropTypes.instanceOf(Directory).isRequired
      ]).isRequired
    ).isRequired
  ]).isRequired,
  filter: PropTypes.func
}

export default DirectoryViewerVirtualized
