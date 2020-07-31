import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized-auto-sizer'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Progress from './Progress'
import Controls from './Controls'
import Volume from './Volume'
import CoverImage from '../CoverImage'
import { nextSong } from '../redux/actions'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  player: {
    borderTop: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(2)
  },
  gridShrink: {
    flex: '0 0 auto'
  },
  gridGrow: {
    flex: '1 1 0px'
  }
}))

let musicPlayer = null // IDK why createRef isn't working

const MusicPlayer = connect(
  (state) => ({
    song: state.musicPlayer.playlist[state.musicPlayer.index],
    playing: state.musicPlayer.playing
  }),
  { nextSong }
)(
  ({ song, playing, nextSong }) => {
    const classes = useStyles()

    useEffect(() => {
      musicPlayer = new window.Audio()
      musicPlayer.volume = 0.4
      musicPlayer.addEventListener('ended', nextSong)
      return () => {
        musicPlayer.removeEventListener('ended', nextSong)
        musicPlayer = null
      }
    }, [])

    useEffect(() => {
      if (!song) return
      musicPlayer.src = `/api/tlmc${urlEncode(song.path)}`
      if (playing) {
        musicPlayer.play()
      }
    }, [song])

    return (
      <div className={classes.player}>
        <Container>
          <Grid container spacing={2}>
            <Grid item className={classes.gridShrink}>
              <CoverImage directory={song && song.parent} width={128} height={128} />
            </Grid>
            <Grid item className={classes.gridGrow}>
              <AutoSizer>
                {({ width, height }) =>
                  <div style={{ width, height }}>
                    <Progress musicPlayer={musicPlayer} />
                    <Box textAlign='center' pt={1} pb={1}>
                      <Typography variant='h6' noWrap>
                        {song ? song.name : <i>No song selected</i>}
                      </Typography>
                    </Box>
                    <Grid container>
                      <Grid item xs={4} />
                      <Grid item xs={4}>
                        <Box textAlign='center'>
                          <Controls musicPlayer={musicPlayer} />
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign='right'>
                          <Volume musicPlayer={musicPlayer} />
                        </Box>
                      </Grid>
                    </Grid>
                  </div>}
              </AutoSizer>
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
)

export default MusicPlayer
