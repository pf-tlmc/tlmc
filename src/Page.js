import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Link from './Link'

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
  },
  breadcrumbs: {
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(0.5, 2),
    color: theme.palette.text.primary,
    '& > ol': {
      minHeight: 27
    }
  }
}))

const Page = ({ contained, breadcrumbs, children }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <AppBar position='relative' elevation={0} className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Link href='/about'>
            <Button variant='contained' color='primary' disableElevation>TLMC</Button>
          </Link>
        </Toolbar>
        {breadcrumbs &&
          <Breadcrumbs className={classes.breadcrumbs}>
            {breadcrumbs}
          </Breadcrumbs>}
      </AppBar>
      <main className={classes.main}>
        <div>
          {contained ? <Container>{children}</Container> : children}
        </div>
      </main>
    </div>
  )
}

Page.propTypes = {
  contained: PropTypes.bool,
  breadcrumbs: PropTypes.node
}

export default Page
