import { combineReducers } from 'redux'

const initialTheme = (typeof window !== 'undefined' && window.localStorage.getItem('theme')) || 'light'

function theme (state = initialTheme, action) {
  switch (action.type) {
    case 'theme.SET_THEME':
      window.localStorage.setItem('theme', action.payload)
      return action.payload
    default:
      return state
  }
}

const reducers = combineReducers({ theme })

export default reducers
