import React, { createRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useForceUpdate } from '../utils'

const useStyles = makeStyles((theme) => ({
  progress: {
    position: 'relative',
    width: '100%',
    height: 20,
    backgroundColor: theme.palette.type === 'dark' ? '#121212' : '#e0e0e0',
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer'
  },
  buffered: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.type === 'dark' ? '#242424' : '#cccccc',
    borderRadius: theme.shape.borderRadius
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius
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
  const timeRanges = musicPlayer.buffered
  const classes = useStyles()
  const ref = createRef()
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    musicPlayer.addEventListener('timeupdate', forceUpdate)
    musicPlayer.addEventListener('progress', forceUpdate)
    return () => {
      musicPlayer.removeEventListener('timeupdate', forceUpdate)
      musicPlayer.removeEventListener('progress', forceUpdate)
    }
  }, [])

  function handleClickProgress (event) {
    const rect = ref.current.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    musicPlayer.currentTime = musicPlayer.duration * percent
  }

  return (
    <div ref={ref} onClick={handleClickProgress} className={classes.progress}>
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
