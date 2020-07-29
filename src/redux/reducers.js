import { combineReducers } from 'redux'

function theme (state = 'light', action) {
  switch (action.type) {
    case 'theme.SET_THEME':
      window.localStorage.setItem('theme', action.payload)
      return action.payload
    default:
      return state
  }
}

function search (state = '', action) {
  switch (action.type) {
    case 'search.INPUT_SEARCH':
      return action.payload
    case 'search.CLEAR':
      return ''
    default:
      return state
  }
}

function searchOptions (state = {}, action) {
  switch (action.type) {
    case 'searchOptions.SET_ROMAJI':
      return {
        ...state,
        romaji: action.payload
      }
    default:
      return state
  }
}

function musicPlayer (state = { playlist: [], currIndex: -1, playing: false }, action) {
  switch (action.type) {
    case 'musicPlayer.TOGGLE_PLAY':
      return {
        ...state,
        playing: !state.playing
      }
    case 'musicPlayer.PLAY_SONG':
      return {
        playlist: [action.payload],
        currIndex: 0,
        playing: true
      }
    default:
      return state
  }
}

const reducers = combineReducers({
  theme,
  search,
  searchOptions,
  musicPlayer
})

export default reducers
