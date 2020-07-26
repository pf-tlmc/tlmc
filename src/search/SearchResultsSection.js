import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DirectoryViewer from '../viewers/DirectoryViewer'
import DirectoryViewerVirtualized from '../viewers/DirectoryViewerVirtualized'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme) => ({
  header: {
    margin: theme.spacing(2, 0, 1, 2)
  },
  expand: {
    display: 'block',
    padding: theme.spacing(1, 4)
  },
  virtualized: {
    height: 500,
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2)
  }
}))

const SearchResultsSection = ({ title, list, expand, setExpand, clearSearch }) => {
  if (list.length === 0) {
    return null
  }

  const classes = useStyles()

  return (
    <>
      <Typography variant='h5' gutterBottom className={classes.header}>{title}</Typography>
      {expand && list.length > 50
        ? (
          <div className={classes.virtualized}>
            <DirectoryViewerVirtualized directory={list} disablePadding onSelect={clearSearch} />
          </div>
        )
        : <DirectoryViewer directory={expand ? list : list.slice(0, 10)} disablePadding onSelect={clearSearch} />}
      {!expand && list.length > 10 &&
        <Link onClick={() => { setExpand(!expand) }} className={classes.expand}>… and {(list.length - 10).toLocaleString()} more results</Link>}
    </>
  )
}

export default SearchResultsSection
