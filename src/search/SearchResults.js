import React from 'react'
import { connect } from 'react-redux'

const SearchResults = connect(
  (state) => ({ search: state.search })
)(
  ({ search }) => {
    return <div>{search}</div>
  }
)

export default SearchResults
