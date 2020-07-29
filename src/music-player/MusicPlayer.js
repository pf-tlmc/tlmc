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
import { togglePlay } from '../redux/actions'
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
    song: state.musicPlayer.playlist[state.musicPlayer.currIndex],
    playing: state.musicPlayer.playing
  }),
  { togglePlay }
)(
  ({ song, playing, togglePlay }) => {
    const classes = useStyles()

    useEffect(() => {
      musicPlayer = new window.Audio()
    }, [])

    useEffect(() => {
      if (!song) return
      musicPlayer.src = `http://home.pf-n.co:3000/tlmc${urlEncode(song.path)}`
      musicPlayer.play()
    }, [song])

    function handleClickPlay () {
      if (playing) {
        musicPlayer.pause()
      } else {
        musicPlayer.play()
      }
      togglePlay()
    }

    return (
      <div className={classes.player}>
        <Container>
          <Grid container spacing={2}>
            <Grid item className={classes.gridShrink}>
              <CoverImage directory={song && song.parent} width={150} height={150} />
            </Grid>
            <Grid item className={classes.gridGrow}>
              <AutoSizer>
                {({ width, height }) =>
                  <div style={{ width, height }}>
                    <Progress audio={musicPlayer} />
                    <Box textAlign='center' pt={1.5}>
                      <Typography variant='h6' noWrap gutterBottom>
                        {song ? song.name : <i>No song selected</i>}
                      </Typography>
                      <IconButton><SkipPreviousIcon /></IconButton>
                      <IconButton onClick={handleClickPlay}>
                        {playing
                          ? <PauseIcon fontSize='large' />
                          : <PlayArrowIcon fontSize='large' />}
                      </IconButton>
                      <IconButton><SkipNextIcon /></IconButton>
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
