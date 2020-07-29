import React, { createRef, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  progress: {
    position: 'relative',
    width: '100%',
    height: 20,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[300],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden'
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
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const ref = createRef()

  useEffect(() => {
    audio.addEventListener('timeupdate', () => {
      setValue(audio.currentTime / audio.duration)
    })
  }, [])

  function handleClickProgress (event) {
    // const rect = ref.current.getBoundingClientRect()
    // const percent = (event.clientX - rect.left) / rect.width
    // audio.currentTime = audio.duration * percent
  }

  return (
    <div ref={ref} onClick={handleClickProgress} className={classes.progress}>
      <div style={{ width: `${value * 100}%` }} className={classes.indicator} />
    </div>
  )
}

export default Progress
