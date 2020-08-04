import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Button from '@material-ui/core/Button'
import { DataProvider, DataConsumer } from '../src/components/DataContext'
import { StoreProvider } from '../src/components/StoreContext'
import { ThemeProvider } from '../src/components/ThemeContext'
import { clearSearch } from '../src/redux/actions'

// Polyfill the path.parse() function
import path from 'path'
import pathParse from 'path-parse'
path.parse = path.parse || pathParse

const Main = connect(null, { clearSearch })(
  ({ clearSearch, children }) => {
    const router = useRouter()

    useEffect(() => {
      router.events.on('routeChangeStart', clearSearch)
      return () => {
        router.events.off('routeChangeStart', clearSearch)
      }
    }, [])

    return (
      <DataConsumer>
        {({ data, error, isPending }) => {
          if (isPending) {
            return (
              <Box pt={10} textAlign='center'>
                <CircularProgress size={100} thickness={5} />
              </Box>
            )
          }

          if (error) {
            console.error(error)
            return (
              <Container>
                <Alert
                  severity='error'
                  elevation={2}
                  action={<Button color='inherit' onClick={() => { Router.reload() }}>Refresh Page</Button>}
                >
                  <AlertTitle><b>Error</b></AlertTitle>
                  Could not load directory structure.
                </Alert>
              </Container>
            )
          }

          return children
        }}
      </DataConsumer>
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
      <DataProvider>
        <StoreProvider>
          <ThemeProvider>
            <CssBaseline />
            <Main>
              <Component {...pageProps} />
            </Main>
          </ThemeProvider>
        </StoreProvider>
      </DataProvider>
    </>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
