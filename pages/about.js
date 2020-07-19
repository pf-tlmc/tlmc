import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh'
  },
  appBar: {
    flexShrink: 0
  },
  main: {
    height: '100%',
    '& > div': {
      height: '100%',
      overflow: 'auto'
    }
  },
  toolbar: {
    minHeight: 0
  }
}))

const TLMC = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <AppBar position='relative' className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Button variant='contained' color='primary' disableElevation>TLMC</Button>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <Container>
          <Typography variant='h2'>About</Typography>
          <Typography paragraph>This is the TLMC</Typography>
        </Container>
      </main>
    </div>
  )
}

export default TLMC
