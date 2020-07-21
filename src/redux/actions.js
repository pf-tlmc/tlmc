export const setTheme = (theme) => ({
  type: 'theme.SET_THEME',
  payload: theme
})

export const setSearch = (search) => ({
  type: 'search.INPUT_SEARCH',
  payload: search
})

export const clearSearch = () => ({
  type: 'search.CLEAR'
})
