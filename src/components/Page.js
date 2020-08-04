import React from 'react'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import TopBar from './TopBar'
import Results from '../search/Results'
import MusicPlayer from '../music-player/MusicPlayer'

const useStyles = makeStyles((theme) => ({
  '@global': {
    'html, body, #__next': {
      width: '100%',
      height: '100%'
    }
  },
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap'
  },
  header: {
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0
  },
  main: {
    flexBasis: '0px',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'auto'
  },
  footer: {
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0
  }
}))

const Page = connect(
  (state) => ({
    search: state.search,
    song: state.musicPlayer.playlist[state.musicPlayer.index]
  })
)(
  ({ search, song, children }) => {
    const classes = useStyles()
    const router = useRouter()
    const theme = useTheme()
    const isMedium = useMediaQuery(theme.breakpoints.up('md'))
    const showSearch = search && isMedium && router.pathname !== '/search'

    return (
      <div className={classes.root}>
        <header className={classes.header}>
          <TopBar />
        </header>
        <main className={classes.main}>
          {showSearch ? <Results /> : children}
        </main>
        {song && (
          <footer className={classes.footer}>
            <MusicPlayer />
          </footer>
        )}
      </div>
    )
  }
)

export default Page
