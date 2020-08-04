import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
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
import SearchIcon from '@material-ui/icons/Search'
import PublicIcon from '@material-ui/icons/Public'
import GitHubIcon from '@material-ui/icons/GitHub'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import Breadcrumbs from './Breadcrumbs'
import Link from './Link'
import Search from '../search/Search'
import { setTheme } from '../redux/actions'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 0,
    '& button': {
      textTransform: 'none',
      color: theme.palette.getContrastText(theme.palette.primary.main)
    }
  },
  buttonContainer: {
    margin: theme.spacing(0, 2),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0
    }
  }
}))

const TopBarButton = ({ isExternal, href, icon, children }) => {
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const LinkComponent = isExternal ? MuiLink : Link

  if (isSmall) {
    return (
      <LinkComponent href={href} underline='none'>
        <IconButton>
          {icon}
        </IconButton>
      </LinkComponent>
    )
  } else {
    return (
      <LinkComponent href={href} underline='none'>
        <Button variant='contained' color='primary' disableElevation startIcon={icon}>
          {children}
        </Button>
      </LinkComponent>
    )
  }
}

TopBarButton.propTypes = {
  isExternal: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.node.isRequired
}

const TopBar = connect(
  (state) => ({ theme: state.theme }),
  { setTheme }
)(
  ({ theme, setTheme }) => {
    const classes = useStyles()
    const router = useRouter()
    const muiTheme = useTheme()
    const isSmall = useMediaQuery(muiTheme.breakpoints.down('sm'))

    const handleToggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
      <AppBar position='relative' elevation={0} component='div'>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <Toolbar className={classes.toolbar}>
              <TopBarButton href='/tlmc' icon={<HomeIcon />}>TLMC</TopBarButton>
              <TopBarButton href='/about' icon={<HelpIcon />}>About</TopBarButton>
              {isSmall && <TopBarButton href='/search' icon={<SearchIcon />}>Search</TopBarButton>}
            </Toolbar>
          </Grid>
          <Grid item>
            <Toolbar className={classes.toolbar}>
              {!isSmall && (
                <>
                  {router.pathname !== '/search' && <Search />}
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
                </>
              )}
              <Brightness5Icon />
              <Switch
                checked={theme === 'dark'}
                onChange={handleToggleTheme}
              />
              <Brightness2Icon />
            </Toolbar>
          </Grid>
        </Grid>
        <Breadcrumbs />
      </AppBar>
    )
  }
)

TopBar.propTypes = {
  showSearch: PropTypes.bool
}

export default TopBar
