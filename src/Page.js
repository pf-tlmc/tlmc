import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
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
  ({ contained, breadcrumbs, search, children }) => {
    const classes = useStyles()

    return (
      <div className={classes.container}>
        <header className={classes.header}>
          <TopBar breadcrumbs={breadcrumbs} />
        </header>
        <main className={classes.main}>
          {search
            ? <SearchResults />
            : (contained ? <Container>{children}</Container> : children)}
        </main>
      </div>
    )
  }
)

Page.propTypes = {
  contained: PropTypes.bool,
  breadcrumbs: PropTypes.any
}

export default Page
