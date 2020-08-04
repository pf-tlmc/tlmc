import React from 'react'
import { connect } from 'react-redux'
import { setSearch } from '../src/redux/actions'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Results from '../src/search/Results'

const Search = connect(
  (state) => ({ search: state.search }),
  { setSearch }
)(
  ({ search, setSearch }) => {
    const handleInputSearch = (event) => {
      setSearch(event.target.value)
    }

    return (
      <>
        <Box p={2}>
          <Container>
            <TextField
              variant='outlined'
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment><SearchIcon /></InputAdornment>
              }}
              label='Search'
              value={search}
              onChange={handleInputSearch}
            />
          </Container>
        </Box>
        <Divider />
        <Results />
      </>
    )
  }
)

export default Search
