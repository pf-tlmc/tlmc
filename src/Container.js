import React from 'react'
import PropTypes from 'prop-types'
import MuiContainer from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

const Container = ({ title, children }) => {
  return (
    <MuiContainer>
      {title && <Typography variant='h5' gutterBottom>{title}</Typography>}
      {children}
    </MuiContainer>
  )
}

Container.propTypes = {
  title: PropTypes.string
}

export default Container
