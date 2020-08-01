import React, { forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import Container from '@material-ui/core/Container'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from '../Link'
import FileIcon from '../FileIcon'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(0.5, 2)
  },
  listIcon: {
    color: 'inherit'
  }
}))

// These values should match the ones defined in DirectoryViewer and Page
const TITLE_SIZE = 50
const ITEM_SIZE = 43
const PADDING_TOP = 8
const PADDING_BOTTOM = 250

const paddedList = forwardRef(({ style, children }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        height: `${parseFloat(style.height) + PADDING_TOP + PADDING_BOTTOM}px`
      }}
    >
      {children}
    </div>
  )
})

const DirectoryViewer = ({ title, directory, filter, disablePadding, onSelect = () => {} }) => {
  const files = Array.isArray(directory) ? directory : [...directory.files]
  const filteredFiles = filter ? files.filter(filter) : files
  const classes = useStyles()

  function renderRow ({ index, style }) {
    const adjustedStyle = {
      ...style,
      top: `${disablePadding ? style.top : parseFloat(style.top) + PADDING_TOP}px`
    }

    if (title && index === 0) {
      return (
        <div style={adjustedStyle}>
          <Container>
            <ListItem className={classes.listItem}>
              <ListItemText><Typography variant='h5' noWrap>{title}</Typography></ListItemText>
            </ListItem>
          </Container>
        </div>
      )
    }

    const file = filteredFiles[title ? index - 1 : index]
    return (
      <Link href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(file.path)} underline='none'>
        <div style={adjustedStyle}>
          <Container>
            <ListItem button onClick={onSelect} className={classes.listItem}>
              <ListItemIcon className={classes.listIcon}><FileIcon file={file} /></ListItemIcon>
              <ListItemText><Typography noWrap>{file.base}</Typography></ListItemText>
            </ListItem>
          </Container>
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
          innerElementType={disablePadding ? undefined : paddedList}
          itemCount={title ? filteredFiles.length + 1 : filteredFiles.length}
          itemSize={(index) => title && index === 0 ? TITLE_SIZE : ITEM_SIZE}
          overscanCount={10}
        >
          {renderRow}
        </List>}
    </AutoSizer>
  )
}

export default DirectoryViewer
