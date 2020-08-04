import React from 'react'
import Head from 'next/head'
import MuiLink from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import PageContainer from '../src/components/PageContainer'
import Section from '../src/components/Section'
import Code from '../src/components/Code'
import Link from '../src/components/Link'

const About = () => {
  return (
    <PageContainer>
      <Head>
        <title>About TLMC</title>
      </Head>
      <Section>
        <Typography variant='h4' gutterBottom>About</Typography>
        <Typography paragraph>
          This website hosts the <MuiLink href='http://www.tlmc.eu/2018/01/tlmc-v19.html'>Touhou Lossless Music Collection v.19</MuiLink> and supplementary materials. Files were also converted to .mp3.
        </Typography>
        <ul>
          <li>
            <Typography>
              <MuiLink href='https://sites.google.com/site/tlmcfiles/Touhou%20lossless%20music%20collection%20v.19.torrent'>Touhou Lossless Music Collection v.19 (torrent)</MuiLink>
            </Typography>
          </li>
          <li>
            <Typography>
              <MuiLink href='https://sites.google.com/site/tlmcfiles/Touhou%20album%20image%20collection%20v.19.torrent'>TLMC album images v.19 (torrent)</MuiLink>
            </Typography>
          </li>
          <li>
            <Typography>
              <MuiLink href='https://sites.google.com/site/tlmcfiles/TLMC%20supplementary%20materials%20v.19.torrent'>TLMC supplementary materials v.19 (torrent)</MuiLink>
            </Typography>
          </li>
        </ul>
        <Typography paragraph>
          All files are served from <MuiLink href='http://serve.tlmc.pf-n.co:3000/tlmc'>http://serve.tlmc.pf-n.co/tlmc</MuiLink>.
        </Typography>
      </Section>

      <Section title='Errors'>
        <Typography paragraph>
          One cue file could not be read from the archive.
        </Typography>
        <Code>
          [556ミリメートル]\2013.05.26 [MMCD-0005~6] 556mm THE BEST Vol.01 -Dancing Girls Best- [例大祭10]\556mm THE BEST Vol.01 -Dancing Girls Best- Disc2 Instrumental Side\556mm THE BEST Vol.01 -Dancing Girls Best- Disc2 Instrumental Side.cue
        </Code>
        <Typography paragraph>
          Three songs could not be converted to .mp3.
        </Typography>
        <Code>
          [DiGiTAL WiNG]\2013.05.26 [DWCD-0008] BEST OF WiNG [例大祭10]\14. S.A.T.O.R.A.R.E (Halozy EUROBEAT Remix).mp3{'\n'}
          [DiGiTAL WiNG]\2013.05.26 [DWCD-0008] BEST OF WiNG [例大祭10]\15. S.A.T.O.R.A.R.E.mp3{'\n'}
          [DiGiTAL WiNG]\2013.05.26 [DWCD-0008] BEST OF WiNG [例大祭10]\16. 止まるなかれ、進むなかれ.mp3
        </Code>
        <Typography paragraph>
          <Link href='/tlmc/[...tlmc_path]' as='/tlmc/error.txt'>See error.txt</Link>
        </Typography>
      </Section>

      <Section title='Questions'>
        <Typography paragraph>
          Please submit all questions, comments, and issues through <MuiLink href='https://github.com/pf-tlmc/tlmc/issues'>GitHub</MuiLink>. You can also email me at <MuiLink href='mailto:thebluepillow@gmail.com'>thebluepillow@gmail.com</MuiLink>.
        </Typography>
      </Section>
    </PageContainer>
  )
}

export default About
