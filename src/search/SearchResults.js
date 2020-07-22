import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearSearch } from '../redux/actions'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import DirectoryViewer from '../viewers/DirectoryViewer'
import Link from '@material-ui/core/Link'
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
  },
  expand: {
    display: 'block',
    padding: theme.spacing(1, 4)
  }
}))

const SearchResultsSection = ({ title, list, expand, setExpand, clearSearch }) => {
  if (list.length === 0) {
    return null
  }

  const classes = useStyles()

  return (
    <>
      <Typography variant='h5' gutterBottom>{title}</Typography>
      <DirectoryViewer directory={expand ? list : list.slice(0, 10)} disablePadding onSelect={clearSearch} />
      {!expand && list.length > 10 &&
        <Link onClick={() => { setExpand(!expand) }} className={classes.expand}>… and {list.length - 10} more results</Link>}
    </>
  )
}

const SearchResults = connect(
  (state) => ({ search: state.search }),
  { clearSearch }
)(
  ({ ls, search, clearSearch }) => {
    const searchResults = useSearch(ls, search)
    const [expandCircles, setExpandCircles] = useState(false)
    const [expandAlbums, setExpandAlbums] = useState(false)
    const [expandSongs, setExpandSongs] = useState(false)
    const [expandOther, setExpandOther] = useState(false)
    const previousSearch = useRef('')

    useEffect(() => {
      if (previousSearch.current !== search) {
        setExpandCircles(false)
        setExpandAlbums(false)
        setExpandSongs(false)
        setExpandOther(false)
      }
      previousSearch.current = search
    })

    if (!searchResults) {
      return null
    }

    const [{ circles, albums, songs, other }, progress] = searchResults
    const classes = useStyles()

    if (circles.length + albums.length + songs.length === 0) {
      return (
        <div className={classes.searchResults}>
          <Typography variant='h5'>{progress < 1 ? 'Searching…' : 'No results'}</Typography>
        </div>
      )
    }

    return (
      <div className={classes.searchResults}>
        <LinearProgress variant='determinate' value={progress * 100} className={classes.progress} />
        <SearchResultsSection
          title='Circles'
          list={circles}
          expand={expandCircles}
          setExpand={setExpandCircles}
          clearSearch={clearSearch}
        />
        <SearchResultsSection
          title='Albums'
          list={albums}
          expand={expandAlbums}
          setExpand={setExpandAlbums}
          clearSearch={clearSearch}
        />
        <SearchResultsSection
          title='Songs'
          list={songs}
          expand={expandSongs}
          setExpand={setExpandSongs}
          clearSearch={clearSearch}
        />
        <SearchResultsSection
          title='Other'
          list={other}
          expand={expandOther}
          setExpand={setExpandOther}
          clearSearch={clearSearch}
        />
      </div>
    )
  }
)

SearchResults.propTypes = {
  ls: PropTypes.object.isRequired
}

export default SearchResults
