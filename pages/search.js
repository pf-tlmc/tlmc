import React from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import deserialize from 'ls-serialize/src/deserialize'
import { connect } from 'react-redux'
import { setSearch } from '../src/redux/actions'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Page from '../src/Page'
import SearchResults from '../src/search/SearchResults'

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(1, 0)
  }
}))

async function fetchAndDeserialize () {
  const res = await fetch('/api/ls')
  const text = await res.text()
  return deserialize(text, {
    levelInd: ' ',
    dirInd: '+',
    fileInd: '-'
  })
}

const Search = connect(
  (state) => ({ search: state.search }),
  { setSearch }
)(
  ({ search, setSearch }) => {
    const { data, error, isPending } = useAsync(fetchAndDeserialize)
    const classes = useStyles()
    const handleInputSearch = (event) => {
      setSearch(event.target.value)
    }

    if (isPending) {
      return (
        <Page>
          <Box pt={10} textAlign='center'>
            <CircularProgress size={100} thickness={5} />
          </Box>
        </Page>
      )
    }

    if (error) {
      console.error(error)
      return (
        <Page>
          <Container>
            <Alert
              severity='error'
              elevation={2}
              action={<Button color='inherit' onClick={() => { Router.reload() }}>Refresh Page</Button>}
            >
              <AlertTitle><b>Error</b></AlertTitle>
              Could not load directory structure.
            </Alert>
          </Container>
        </Page>
      )
    }

    return (
      <Page>
        <Box px={2} py={1}>
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
        </Box>
        <Divider className={classes.divider} />
        <SearchResults ls={data} />
      </Page>
    )
  }
)

export default Search
