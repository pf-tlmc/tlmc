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

const reducers = combineReducers({ theme, search })

export default reducers
