import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized-auto-sizer'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import Progress from './Progress'
import CoverImage from '../CoverImage'
import { togglePlay, previousSong, nextSong } from '../redux/actions'
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
    playlist: state.musicPlayer.playlist,
    index: state.musicPlayer.index,
    playing: state.musicPlayer.playing
  }),
  { togglePlay, previousSong, nextSong }
)(
  ({ playlist, index, playing, togglePlay, previousSong, nextSong }) => {
    const classes = useStyles()
    const song = playlist[index]

    useEffect(() => {
      musicPlayer = new window.Audio()
      musicPlayer.addEventListener('ended', nextSong)
    }, [])

    useEffect(() => {
      if (!song) return
      musicPlayer.src = `/api/tlmc${urlEncode(song.path)}`
      musicPlayer.play()
    }, [song])

    const handleClickPlay = () => {
      if (playing) {
        musicPlayer.pause()
      } else {
        musicPlayer.play()
      }
      togglePlay()
    }

    const handleClickPrevious = () => {
      if (index === 0 || musicPlayer.currentTime > 5) {
        musicPlayer.currentTime = 0
      } else {
        previousSong()
      }
    }

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
                    <Progress audio={musicPlayer} />
                    <Box textAlign='center' pt={1}>
                      <Typography variant='h6' noWrap gutterBottom>
                        {song ? song.name : <i>No song selected</i>}
                      </Typography>
                      <IconButton onClick={handleClickPrevious}><SkipPreviousIcon /></IconButton>
                      <IconButton onClick={handleClickPlay}>
                        {playing
                          ? <PauseIcon fontSize='large' />
                          : <PlayArrowIcon fontSize='large' />}
                      </IconButton>
                      <IconButton onClick={nextSong}><SkipNextIcon /></IconButton>
                    </Box>
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
