import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { lightTheme, darkTheme } from '../src/themes'
import store from '../src/redux/store'

// Polyfill the path.parse() function
import path from 'path'
import pathParse from 'path-parse'
path.parse = path.parse || pathParse

const Themer = connect((state) => ({ theme: state.theme }))(
  ({ theme, children }) => {
    return (
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    )
  }
)

const App = ({ Component, pageProps, theme }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>TLMC</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
      <Provider store={store}>
        <Themer>
          <CssBaseline />
          <Component {...pageProps} />
        </Themer>
      </Provider>
    </>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
