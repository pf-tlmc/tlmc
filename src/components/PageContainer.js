import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4)
  }
}))

const PageContainer = ({ children }) => {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      {children}
    </Container>
  )
}

export default PageContainer
