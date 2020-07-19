import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import MuiLink from '@material-ui/core/Link'
import PublicIcon from '@material-ui/icons/Public'
import GitHubIcon from '@material-ui/icons/GitHub'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import Brightness5Icon from '@material-ui/icons/Brightness5'
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
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <Toolbar className={classes.toolbar}>
              <Link href='/'>
                <Button variant='contained' color='primary' disableElevation>
                  TLMC
                </Button>
              </Link>
            </Toolbar>
          </Grid>
          <Grid item>
            <Toolbar className={classes.toolbar}>
              <MuiLink href='http://www.tlmc.eu/search/label/TLMC'>
                <Button variant='contained' color='primary' disableElevation startIcon={<PublicIcon />}>
                  tlmc.eu
                </Button>
              </MuiLink>
              <MuiLink href='https://github.com/pf-tlmc/tlmc'>
                <Button variant='contained' color='primary' disableElevation startIcon={<GitHubIcon />}>
                  GitHub
                </Button>
              </MuiLink>
              <Brightness5Icon />
              <Switch />
              <Brightness2Icon />
            </Toolbar>
          </Grid>
        </Grid>
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
