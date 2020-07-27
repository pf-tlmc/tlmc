import React from 'react'
import Typography from '@material-ui/core/Typography'
import Page from '../src/Page'
import Container from '../src/Container'

const About = () => {
  return (
    <Page>
      <Container>
        <Typography variant='h4' gutterBottom>About</Typography>
        <Typography paragraph>This is the TLMC</Typography>
      </Container>
    </Page>
  )
}

export default About
