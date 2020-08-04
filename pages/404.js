import React from 'react'
import Head from 'next/head'
import Typography from '@material-ui/core/Typography'
import PageContainer from '../src/components/PageContainer'
import Section from '../src/components/Section'

const Error404 = () => {
  return (
    <PageContainer>
      <Head>
        <title>404</title>
      </Head>
      <Section>
        <Typography variant='h4' gutterBottom>404</Typography>
      </Section>
    </PageContainer>
  )
}

export default Error404
