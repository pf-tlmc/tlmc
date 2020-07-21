import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setTheme } from './redux/actions'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Switch from '@material-ui/core/Switch'
import MuiLink from '@material-ui/core/Link'
import HomeIcon from '@material-ui/icons/Home'
import HelpIcon from '@material-ui/icons/Help'
import PublicIcon from '@material-ui/icons/Public'
import GitHubIcon from '@material-ui/icons/GitHub'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import Breadcrumbs from './Breadcrumbs'
import Link from './Link'
import Search from './search/Search'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 0,
    '& button': {
      textTransform: 'none'
    }
  },
  buttonContainer: {
    margin: theme.spacing(0, 2)
  }
}))

const TopBarButton = ({ isExternal, href, icon, children }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const LinkComponent = isExternal ? MuiLink : Link

  if (isSmall) {
    return (
      <LinkComponent href={href}>
        <IconButton>
          {icon}
        </IconButton>
      </LinkComponent>
    )
  } else {
    return (
      <LinkComponent href={href}>
        <Button variant='contained' color='primary' disableElevation startIcon={icon}>
          {children}
        </Button>
      </LinkComponent>
    )
  }
}

const TopBar = connect(
  (state) => ({ theme: state.theme }),
  { setTheme }
)(
  ({ breadcrumbs, theme, setTheme }) => {
    const muiTheme = useTheme()
    const isMedium = useMediaQuery(muiTheme.breakpoints.up('md'))
    const classes = useStyles()

    const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
      <AppBar position='relative' elevation={0} component='div'>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <Toolbar className={classes.toolbar}>
              <TopBarButton href='/tlmc' icon={<HomeIcon />}>TLMC</TopBarButton>
              <TopBarButton href='/about' icon={<HelpIcon />}>About</TopBarButton>
            </Toolbar>
          </Grid>
          <Grid item>
            <Toolbar className={classes.toolbar}>
              {isMedium && <Search />}
              <div className={classes.buttonContainer}>
                <TopBarButton
                  isExternal
                  href='http://www.tlmc.eu/search/label/TLMC'
                  icon={<PublicIcon />}
                >
                  tlmc.eu
                </TopBarButton>
                <TopBarButton
                  isExternal
                  href='https://github.com/pf-tlmc/tlmc'
                  icon={<GitHubIcon />}
                >
                  GitHub
                </TopBarButton>
              </div>
              <Brightness5Icon />
              <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <Brightness2Icon />
            </Toolbar>
          </Grid>
        </Grid>
        {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      </AppBar>
    )
  }
)

TopBar.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      as: PropTypes.string
    }).isRequired
  )
}

export default TopBar
