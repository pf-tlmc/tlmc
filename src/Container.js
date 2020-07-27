import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import MuiContainer from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2)
  }
}))

const Container = ({ fullWidth, title, children }) => {
  const classes = useStyles()

  return (
    <MuiContainer maxWidth={fullWidth ? false : 'lg'} className={classes.container}>
      {title && <Typography variant='h5' gutterBottom>{title}</Typography>}
      {children}
    </MuiContainer>
  )
}

Container.propTypes = {
  fullWidth: PropTypes.bool,
  title: PropTypes.string
}

export default Container
