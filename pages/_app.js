import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { lightTheme, darkTheme } from '../src/themes'

// Polyfill the path.parse() function
import path from 'path'
import pathParse from 'path-parse'
path.parse = path.parse || pathParse

// Can't think of a better way to get the theme stuff to the Switch
export const ThemeChanger = createContext('themeChanger')

const App = ({ Component, pageProps }) => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
    setTheme((typeof window !== 'undefined' && window.localStorage.getItem('theme')) || 'light')
  }, [])

  useEffect(() => {
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const changeTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <>
      <Head>
        <title>TLMC</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        <ThemeChanger.Provider value={{ theme, changeTheme }}>
          <Component {...pageProps} />
        </ThemeChanger.Provider>
      </ThemeProvider>
    </>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
