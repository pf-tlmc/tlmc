import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const SearchResults = connect(
  (state) => ({ search: state.search })
)(
  ({ ls, search }) => {
    return (
      <Box p={2}>
        <Typography variant='h5'>Search Results</Typography>
      </Box>
    )
  }
)

SearchResults.propTypes = {
  ls: PropTypes.object.isRequired
}

export default SearchResults
