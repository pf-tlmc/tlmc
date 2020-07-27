import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import MuiContainer from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(1)
  }
}))

const Container = ({ title, children }) => {
  const classes = useStyles()

  return (
    <MuiContainer className={classes.container}>
      {title && <Typography variant='h5' gutterBottom>{title}</Typography>}
      {children}
    </MuiContainer>
  )
}

Container.propTypes = {
  title: PropTypes.string
}

export default Container
