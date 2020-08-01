import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import { togglePlay, previousSong, nextSong } from '../redux/actions'

const useStyles = makeStyles((theme) => ({
  controls: {
    whiteSpace: 'nowrap'
  }
}))

const Controls = connect(
  (state) => ({
    index: state.musicPlayer.index,
    playing: state.musicPlayer.playing
  }),
  { togglePlay, previousSong, nextSong }
)(
  ({ musicPlayer, index, playing, togglePlay, previousSong, nextSong }) => {
    const classes = useStyles()

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

    const handleClickNext = nextSong

    return (
      <div className={classes.controls}>
        <Tooltip title='Previous'>
          <IconButton onClick={handleClickPrevious}>
            <SkipPreviousIcon />
          </IconButton>
        </Tooltip>
        {playing ? (
          <Tooltip title='Pause'>
            <IconButton onClick={handleClickPlay}>
              <PauseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Play'>
            <IconButton onClick={handleClickPlay}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title='Next'>
          <IconButton onClick={handleClickNext}>
            <SkipNextIcon />
          </IconButton>
        </Tooltip>
      </div>
    )
  }
)

if (typeof window !== 'undefined') {
  Controls.propTypes = {
    musicPlayer: PropTypes.instanceOf(window.Audio).isRequired
  }
}

export default Controls
