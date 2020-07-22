import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { connect } from 'react-redux'
import { clearSearch, setSearchOptions } from '../redux/actions'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import LinearProgress from '@material-ui/core/LinearProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import DirectoryViewer from '../viewers/DirectoryViewer'
import DirectoryViewerVirtualized from '../viewers/DirectoryViewerVirtualized'
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
  progressComplete: {
    opacity: 0,
    transition: 'opacity 0.4s linear'
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
      <Typography variant='h5' gutterBottom>{title}</Typography>
      {expand && list.length > 100
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

const SearchResults = connect(
  (state) => ({ search: state.search, options: state.searchOptions }),
  { clearSearch, setSearchOptions }
)(
  ({ ls, search, options, clearSearch, setSearchOptions }) => {
    const searchResults = useSearch(ls, search, options)
    const [expandCircles, setExpandCircles] = useState(false)
    const [expandAlbums, setExpandAlbums] = useState(false)
    const [expandSongs, setExpandSongs] = useState(false)
    const [expandOther, setExpandOther] = useState(false)
    const previousSearch = useRef('')
    const previousOptions = useRef(null)

    useEffect(() => {
      if (previousSearch.current !== search || previousOptions.current !== options) {
        setExpandCircles(false)
        setExpandAlbums(false)
        setExpandSongs(false)
        setExpandOther(false)
      }
      previousSearch.current = search
      previousOptions.current = options
    })

    if (!searchResults) {
      return null
    }

    const [{ circles, albums, songs, other }, progress] = searchResults
    const classes = useStyles()

    return (
      <div className={classes.searchResults}>
        <Box p={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={options.romaji}
                onChange={() => { setSearchOptions('SET_ROMAJI', !options.romaji) }}
                color='primary'
              />
            }
            label='Romanize hiragana/katakana when searching'
          />
        </Box>
        <LinearProgress
          variant='determinate'
          value={progress * 100}
          className={cn(classes.progress, progress >= 1 && classes.progressComplete)}
        />
        {circles.length + albums.length + songs.length === 0
          ? <Typography variant='h5'>{progress < 1 ? 'Searching…' : 'No results'}</Typography>
          : (
            <>
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
            </>
          )}
      </div>
    )
  }
)

SearchResults.propTypes = {
  ls: PropTypes.object.isRequired
}

export default SearchResults
