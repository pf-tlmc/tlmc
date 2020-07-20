import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
// import FormControl from '@material-ui/core/FormControl'
// import FilledInput from '@material-ui/core/FilledInput'
// import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import MuiLink from '@material-ui/core/Link'
// import SearchIcon from '@material-ui/icons/Search'
import PublicIcon from '@material-ui/icons/Public'
import GitHubIcon from '@material-ui/icons/GitHub'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import Breadcrumbs from './Breadcrumbs'
import Link from './Link'
import { ThemeChanger } from '../pages/_app'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 0,
    '& button': {
      textTransform: 'none'
    }
  },
  // search: {
  //   color: 'inherit',
  //   '& input': {
  //     paddingTop: theme.spacing(0.75)
  //   }
  // },
  buttonContainer: {
    marginRight: theme.spacing(2)
  }
}))

const TopBar = ({ breadcrumbs }) => {
  const classes = useStyles()

  return (
    <AppBar position='relative' elevation={0} component='div'>
      <Grid container justify='space-between' alignItems='center'>
        <Grid item>
          <Toolbar className={classes.toolbar}>
            <Link href='/about'>
              <Button variant='contained' color='primary' disableElevation>
                TLMC
              </Button>
            </Link>
          </Toolbar>
        </Grid>
        <Grid item>
          <Toolbar className={classes.toolbar}>
            {/*
              <FormControl size='small'>
                <FilledInput
                  disableUnderline
                  startAdornment={<InputAdornment><SearchIcon /></InputAdornment>}
                  placeholder='Search...'
                  type='search'
                  className={classes.search}
                />
              </FormControl>
            */}
            <div className={classes.buttonContainer}>
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
            </div>
            <ThemeChanger.Consumer>
              {({ theme, changeTheme }) => (
                <>
                  <Brightness5Icon />
                  <Switch
                    checked={theme === 'dark'}
                    onChange={changeTheme}
                  />
                  <Brightness2Icon />
                </>
              )}
            </ThemeChanger.Consumer>
          </Toolbar>
        </Grid>
      </Grid>
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
    </AppBar>
  )
}

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
