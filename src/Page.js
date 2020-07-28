import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Container from '@material-ui/core/Container'
import TopBar from './TopBar'
import SearchResults from './search/SearchResults'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    '&': {
      height: '-webkit-fill-available'
    }
  },
  header: {
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 0
  },
  main: {
    flexBasis: '0px',
    flexGrow: 1,
    flexShrink: 1,
    overflow: 'auto',
    padding: ({ noPadding }) => noPadding ? 0 : theme.spacing(2, 0)
  }
}))

const Page = connect(
  (state) => ({ search: state.search })
)(
  ({ noPadding, contained, breadcrumbs, ls, search, children }) => {
    const theme = useTheme()
    const isMedium = useMediaQuery(theme.breakpoints.up('md'))
    const showSearch = ls && isMedium
    const classes = useStyles({ noPadding: noPadding || (showSearch && search) })

    return (
      <div className={classes.container}>
        <header className={classes.header}>
          <TopBar breadcrumbs={breadcrumbs} showSearch={showSearch} />
        </header>
        <main className={classes.main}>
          {(showSearch && search)
            ? <SearchResults ls={ls} />
            : (contained ? <Container>{children}</Container> : children)}
        </main>
      </div>
    )
  }
)

Page.propTypes = {
  noPadding: PropTypes.bool,
  breadcrumbs: PropTypes.any,
  ls: PropTypes.object
}

export default Page
