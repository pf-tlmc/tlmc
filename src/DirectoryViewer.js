import React from 'react'
import PropTypes from 'prop-types'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from './Link'
import FileIcon from './FileIcon'

const DirectoryViewer = ({ directory }) => {
  const files = [...directory.files]

  function renderRow ({ index, style }) {
    const file = files[index]
    return (
      <Link href='/tlmc/[...tlmc_path]' as={'/tlmc' + file.path}>
        <ListItem button style={style}>
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
          itemCount={files.length}
          itemSize={42}
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
