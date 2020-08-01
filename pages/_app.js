import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Provider, connect } from 'react-redux'
import { setTheme } from '../src/redux/actions'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { lightTheme, darkTheme } from '../src/themes'
import store from '../src/redux/store'

// Polyfill the path.parse() function
import path from 'path'
import pathParse from 'path-parse'
path.parse = path.parse || pathParse

const Themer = connect(
  (state) => ({ theme: state.theme }),
  { setTheme }
)(
  ({ theme, setTheme, children }) => {
    useEffect(() => {
      const initialTheme = (typeof window !== 'undefined' && window.localStorage.getItem('theme')) || 'light'
      setTheme(initialTheme)
    }, [])

    return (
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    )
  }
)

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Touhou Lossless Music Collection</title>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
        <script async src='https://www.googletagmanager.com/gtag/js?id=UA-137452548-2' />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-137452548-2');
            `
          }}
        />
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
