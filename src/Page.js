import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import TopBar from './TopBar'
import Container from './Container'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '100vh',
    flexFlow: 'column nowrap'
  },
  header: {
    height: 'auto',
    flex: '0 0 auto'
  },
  main: {
    height: 'auto',
    flex: '1 1 0px',
    overflow: 'auto'
  }
}))

const Page = ({ contained, breadcrumbs, children }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <TopBar breadcrumbs={breadcrumbs} />
      </header>
      <main className={classes.main}>
        {contained ? <Container>{children}</Container> : children}
      </main>
    </div>
  )
}

Page.propTypes = {
  contained: PropTypes.bool,
  breadcrumbs: PropTypes.any
}

export default Page
