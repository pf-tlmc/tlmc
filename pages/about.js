import React from 'react'
import Typography from '@material-ui/core/Typography'
import Page from '../src/components/Page'

const About = () => {
  return (
    <Page contained>
      <Typography variant='h4' gutterBottom>About</Typography>
      <Typography paragraph>This is the TLMC</Typography>
    </Page>
  )
}

export default About
