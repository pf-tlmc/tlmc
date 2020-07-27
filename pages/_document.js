import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'

class MyDocument extends Document {
  render () {
    return (
      <Html lang='en'>
        <Head>
          <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Open+Sans&display=swap' />
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
  })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()]
  }
}

export default MyDocument
