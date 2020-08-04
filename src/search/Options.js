import React from 'react'
import { connect } from 'react-redux'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { setSearchOptions } from '../redux/actions'

const Options = connect(
  (state) => ({ options: state.searchOptions }),
  { setSearchOptions }
)(
  ({ options, setSearchOptions }) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={options.romaji}
            onChange={() => { setSearchOptions('SET_ROMAJI', !options.romaji) }}
            color='primary'
          />
        }
        label='Romanize hiragana/katakana when searching'
      />
    )
  }
)

export default Options