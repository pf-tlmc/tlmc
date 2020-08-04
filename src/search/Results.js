import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { DataConsumer } from '../components/DataContext'
import PageContainer from '../components/PageContainer'
import Section from '../components/Section'
import Options from './Options'
import ResultsSection from './ResultsSection'
import useSearch from './use-search'

const useStyles = makeStyles((theme) => ({
  progress: {
    '& > div': {
      transition: 'none'
    }
  },
  progressComplete: {
    opacity: 0,
    transition: 'opacity 0.4s linear'
  },
  header: {
    margin: theme.spacing(2, 0, 1, 2)
  }
}))

const ResultsContainer = () => {
  return (
    <DataConsumer>
      {({ data: { ls } }) => <Results ls={ls} />}
    </DataConsumer>
  )
}

const Results = connect(
  (state) => ({ search: state.search, options: state.searchOptions })
)(
  ({ ls, search, options }) => {
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
      <>
        <LinearProgress
          variant='determinate'
          color='secondary'
          value={progress * 100}
          className={clsx(classes.progress, progress >= 1 && classes.progressComplete)}
        />
        <PageContainer>
          <Section>
            <Options />
          </Section>
          {circles.length + albums.length + songs.length + other.length === 0 ? (
            <Typography variant='h5' className={classes.header}>
              {progress < 1 ? 'Searching…' : 'No results'}
            </Typography>
          ) : (
            <>
              <ResultsSection
                title='Circles'
                list={circles}
                expand={expandCircles}
                setExpand={setExpandCircles}
              />
              <ResultsSection
                title='Albums'
                list={albums}
                expand={expandAlbums}
                setExpand={setExpandAlbums}
              />
              <ResultsSection
                title='Songs'
                list={songs}
                expand={expandSongs}
                setExpand={setExpandSongs}
              />
              <ResultsSection
                title='Other'
                list={other}
                expand={expandOther}
                setExpand={setExpandOther}
              />
            </>
          )}
        </PageContainer>
      </>
    )
  }
)

Results.propTypes = {
  ls: PropTypes.object.isRequired
}

export default ResultsContainer
