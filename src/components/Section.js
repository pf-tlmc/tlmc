import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4)
  }
}))

const Section = ({ title, children }) => {
  const classes = useStyles()

  return (
    <section className={classes.root}>
      {title && <Typography variant='h5' gutterBottom>{title}</Typography>}
      {children}
    </section>
  )
}

Section.propTypes = {
  title: PropTypes.string
}

export default Section
