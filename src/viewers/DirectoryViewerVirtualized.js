import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from '../Link'
import FileIcon from '../FileIcon'
import urlEncode from '../urlEncode'

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(0.5, 4)
  },
  listIcon: {
    color: 'inherit'
  }
}))

// These values should match the ones defined in DirectoryViewer
const ITEM_SIZE = 43
const PADDING_TOP = 8
const PADDING_BOTTOM = 160

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

const DirectoryViewer = ({ directory, filter = () => true }) => {
  const files = [...directory.files].filter(filter)
  const classes = useStyles()

  function renderRow ({ index, style }) {
    const file = files[index]
    return (
      <Link href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(file.path)}>
        <ListItem
          button
          style={{
            ...style,
            top: `${parseFloat(style.top) + PADDING_TOP}px`
          }}
          className={classes.listItem}
        >
          <ListItemIcon className={classes.listIcon}><FileIcon file={file} /></ListItemIcon>
          <ListItemText><Typography noWrap>{file.base}</Typography></ListItemText>
        </ListItem>
      </Link>
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          width={width}
          innerElementType={paddedList}
          itemCount={files.length}
          itemSize={ITEM_SIZE}
          overscanCount={10}
        >
          {renderRow}
        </List>
      )}
    </AutoSizer>
  )
}

DirectoryViewer.propTypes = {
  directory: PropTypes.object.isRequired,
  filter: PropTypes.func
}

export default DirectoryViewer