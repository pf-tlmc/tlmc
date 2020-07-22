import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearSearch } from '../redux/actions'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import DirectoryViewer from '../viewers/DirectoryViewer'
import useSearch from './use-search'

const useStyles = makeStyles((theme) => ({
  searchResults: {
    padding: theme.spacing(0, 0, 20),
    '& h5': {
      margin: theme.spacing(2, 0, 1, 2)
    }
  },
  progress: {
    position: 'fixed',
    width: '100vw',
    bottom: 0,
    '& > div': {
      transition: 'none'
    }
  }
}))

const SearchResults = connect(
  (state) => ({ search: state.search }),
  { clearSearch }
)(
  ({ ls, search, clearSearch }) => {
    const searchResults = useSearch(ls, search)

    if (!searchResults) {
      return null
    }

    const [{ circles, albums, songs, other }, progress] = searchResults
    const classes = useStyles()

    if (circles.length + albums.length + songs.length === 0) {
      return (
        <div className={classes.searchResults}>
          <Typography variant='h5'>{progress < 1 ? 'Searching...' : 'No results'}</Typography>
        </div>
      )
    }

    return (
      <div className={classes.searchResults}>
        <LinearProgress variant='determinate' value={progress * 100} className={classes.progress} />
        {circles.length > 0 &&
          <>
            <Typography variant='h5' gutterBottom>Circles</Typography>
            <DirectoryViewer directory={circles.slice(0, 10)} disablePadding onSelect={clearSearch} />
          </>}
        {albums.length > 0 &&
          <>
            <Typography variant='h5' gutterBottom>Albums</Typography>
            <DirectoryViewer directory={albums.slice(0, 10)} disablePadding onSelect={clearSearch} />
          </>}
        {songs.length > 0 &&
          <>
            <Typography variant='h5' gutterBottom>Songs</Typography>
            <DirectoryViewer directory={songs.slice(0, 10)} disablePadding onSelect={clearSearch} />
          </>}
        {other.length > 0 &&
          <>
            <Typography variant='h5' gutterBottom>Other</Typography>
            <DirectoryViewer directory={other.slice(0, 10)} disablePadding onSelect={clearSearch} />
          </>}
      </div>
    )
  }
)

SearchResults.propTypes = {
  ls: PropTypes.object.isRequired
}

export default SearchResults
