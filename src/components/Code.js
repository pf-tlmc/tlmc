import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: 'auto',
    margin: theme.spacing(0, 0, 2),
    padding: theme.spacing(2)
  }
}))

const Code = ({ children }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.root} component='pre'>
      <code>
        {children}
      </code>
    </Paper>
  )
}

export default Code
