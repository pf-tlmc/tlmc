import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { setTheme } from '../redux/actions'
import { lightTheme, darkTheme } from '../themes'

export const ThemeProvider = connect(
  (state) => ({ theme: state.theme }),
  { setTheme }
)(
  ({ theme, setTheme, children }) => {
    useEffect(() => {
      const initialTheme = (typeof window !== 'undefined' && window.localStorage.getItem('theme')) || 'light'
      setTheme(initialTheme)
    }, [])

    return (
      <MuiThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        {children}
      </MuiThemeProvider>
    )
  }
)
