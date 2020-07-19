import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from './Link'
import FileIcon from './FileIcon'

const ITEM_SIZE = 42
const PADDING_TOP = 5
const PADDING_BOTTOM = ITEM_SIZE * 2

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

const DirectoryViewer = ({ directory }) => {
  const files = [...directory.files]

  function renderRow ({ index, style }) {
    const file = files[index]
    return (
      <Link href='/tlmc/[...tlmc_path]' as={'/tlmc' + file.path}>
        <ListItem
          button
          style={{
            ...style,
            top: `${parseFloat(style.top) + PADDING_TOP}px`
          }}
        >
          <ListItemIcon><FileIcon file={file} /></ListItemIcon>
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
  directory: PropTypes.object.isRequired
}

export default DirectoryViewer
