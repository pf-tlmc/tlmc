import React, { useState, createRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { useForceUpdate } from '../utils'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative'
  },
  progress: {
    position: 'relative',
    width: '100%',
    height: 20,
    backgroundColor: theme.palette.type === 'dark' ? '#121212' : '#e0e0e0',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    cursor: 'pointer'
  },
  buffered: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.type === 'dark' ? '#242424' : '#cccccc'
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: theme.palette.primary.main
  },
  seeker: {
    position: 'absolute',
    top: 0,
    height: 20,
    width: 1,
    backgroundColor: theme.palette.primary.dark,
    pointerEvents: 'none'
  },
  tooltip: {
    position: 'absolute',
    transform: 'translate(-50%, -32px)',
    padding: theme.spacing(0.25, 0.5),
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.getContrastText(theme.palette.grey[800])
  },
  currentTime: {
    position: 'absolute',
    top: 24,
    left: 0
  },
  duration: {
    position: 'absolute',
    top: 24,
    right: 0
  }
}))

function formatTime (time) {
  const minutes = time / 60 | 0
  const seconds = time % 60 | 0
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

const Progress = ({ musicPlayer }) => {
  const classes = useStyles()
  const [isHover, setIsHover] = useState(false)
  const [hoverPosition, setHoverPosition] = useState(0)
  const ref = createRef()
  const forceUpdate = useForceUpdate()
  const timeRanges = musicPlayer.buffered

  useEffect(() => {
    musicPlayer.addEventListener('timeupdate', forceUpdate)
    musicPlayer.addEventListener('progress', forceUpdate)
    return () => {
      musicPlayer.removeEventListener('timeupdate', forceUpdate)
      musicPlayer.removeEventListener('progress', forceUpdate)
    }
  }, [])

  const handleClickProgress = (event) => {
    const rect = ref.current.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    musicPlayer.currentTime = musicPlayer.duration * percent
    forceUpdate()
  }

  const handleMouseOver = (event) => {
    const rect = ref.current.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    setHoverPosition(percent)
  }

  return (
    <div
      ref={ref}
      onClick={handleClickProgress}
      onMouseMove={handleMouseOver}
      onMouseEnter={setIsHover.bind(null, true)}
      onMouseLeave={setIsHover.bind(null, false)}
      className={classes.container}
    >
      <div className={classes.progress}>
        {Array(timeRanges.length).fill().map((_, index) => {
          const start = timeRanges.start(index)
          const duration = timeRanges.end(index) - start
          return (
            <div
              key={index}
              style={{
                left: `${start / musicPlayer.duration * 100}%`,
                width: `${duration / musicPlayer.duration * 100}%`
              }}
              className={classes.buffered}
            />
          )
        })}
        <div
          style={{
            width: `${(musicPlayer.currentTime / musicPlayer.duration) * 100}%`
          }}
          className={classes.indicator}
        />
      </div>
      {isHover &&
        <div
          style={{
            left: `${hoverPosition * 100}%`
          }}
          className={classes.seeker}
        >
          <Paper className={classes.tooltip}>
            {formatTime(hoverPosition * musicPlayer.duration)}
          </Paper>
        </div>}
      <div className={classes.currentTime}>{formatTime(musicPlayer.currentTime)}</div>
      <div className={classes.duration}>{formatTime(musicPlayer.duration)}</div>
    </div>
  )
}

if (typeof window !== 'undefined') {
  Progress.propTypes = {
    musicPlayer: PropTypes.instanceOf(window.Audio).isRequired
  }
}

export default Progress
