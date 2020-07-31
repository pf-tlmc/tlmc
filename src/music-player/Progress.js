import React, { createRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useForceUpdate } from '../utils'

const useStyles = makeStyles((theme) => ({
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
  }
}))

const Progress = ({ audio }) => {
  const timeRanges = audio.buffered
  const classes = useStyles()
  const ref = createRef()
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    audio.addEventListener('timeupdate', forceUpdate)
    audio.addEventListener('progress', forceUpdate)
    return () => {
      audio.removeEventListener('timeupdate', forceUpdate)
      audio.removeEventListener('progress', forceUpdate)
    }
  }, [])

  function handleClickProgress (event) {
    const rect = ref.current.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    audio.currentTime = audio.duration * percent
  }

  return (
    <div ref={ref} onClick={handleClickProgress} className={classes.progress}>
      {Array(timeRanges.length).fill().map((_, index) =>
        <div
          key={index}
          style={{
            left: `${timeRanges.start(index) / audio.duration * 100}%`,
            width: `${(timeRanges.end(index) - timeRanges.start(index)) / audio.duration * 100}%`
          }}
          className={classes.buffered}
        />)}
      <div
        style={{
          width: `${(audio.currentTime / audio.duration) * 100}%`
        }}
        className={classes.indicator}
      />
    </div>
  )
}

export default Progress
