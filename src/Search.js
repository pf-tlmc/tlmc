import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FilledInput from '@material-ui/core/FilledInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme) => ({
  search: {
    width: 500,
    borderRadius: theme.shape.borderRadius,
    color: 'inherit',
    [theme.breakpoints.down('md')]: {
      width: 300
    },
    '& input': {
      paddingTop: theme.spacing(0.75)
    }
  }
}))

const Search = () => {
  const classes = useStyles()

  return (
    <FormControl size='small'>
      <FilledInput
        disableUnderline
        fullWidth
        startAdornment={<InputAdornment><SearchIcon /></InputAdornment>}
        placeholder='Search...'
        type='search'
        className={classes.search}
      />
    </FormControl>
  )
}

export default Search
