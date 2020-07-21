import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import TopBar from './TopBar'
import Container from './Container'
import SearchResults from './search/SearchResults'

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

const Page = connect(
  (state) => ({ search: state.search })
)(
  ({ contained, breadcrumbs, ls, search, children }) => {
    const theme = useTheme()
    const isMedium = useMediaQuery(theme.breakpoints.up('md'))
    const classes = useStyles()
    const showSearch = ls && isMedium

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
  contained: PropTypes.bool,
  breadcrumbs: PropTypes.any,
  ls: PropTypes.object
}

export default Page
