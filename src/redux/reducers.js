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

function musicPlayer (state = { playlist: [], index: -1, playing: false }, action) {
  switch (action.type) {
    case 'musicPlayer.TOGGLE_PLAY':
      return {
        ...state,
        playing: !state.playing
      }
    case 'musicPlayer.PLAY_SONG':
      return {
        playlist: [action.payload],
        index: 0,
        playing: true
      }
    case 'musicPlayer.QUEUE_SONG': {
      if (!action.payload) return state

      const lastSong = state.playlist[state.playlist.length - 1]
      if (!lastSong || action.payload.path !== lastSong.path) {
        return {
          ...state,
          playlist: state.playlist.concat([action.payload])
        }
      } else {
        return state
      }
    }
    case 'musicPlayer.PREVIOUS_SONG': {
      if (state.index > 0) {
        return {
          ...state,
          index: state.index - 1,
          playing: true
        }
      } else {
        return state
      }
    }
    case 'musicPlayer.NEXT_SONG': {
      if (state.index < state.playlist.length - 1) {
        return {
          ...state,
          index: state.index + 1
        }
      } else {
        return state
      }
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
