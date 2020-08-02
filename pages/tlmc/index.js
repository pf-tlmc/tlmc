import React from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import Router, { useRouter } from 'next/router'
import deserialize from 'ls-serialize/src/deserialize'
import Head from 'next/head'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
// import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Page from '../../src/components/Page'
import Section from '../../src/components/Section'
import DirectoryViewer from '../../src/viewers/DirectoryViewer'
import DirectoryViewerVirtualized from '../../src/viewers/DirectoryViewerVirtualized'
import AlbumViewer from '../../src/viewers/AlbumViewer'
import AlbumListViewer from '../../src/viewers/AlbumListViewer'
import FileViewer from '../../src/viewers/FileViewer'
import Error404 from '../404'
import { hasAlbum, urlEncode, parseCue } from '../../src/utils'

async function fetchAndDeserialize () {
  const [lsRes, cueRes] = await Promise.all([
    fetch('/api/ls'),
    fetch('/api/cue')
  ])
  return {
    ls: deserialize(await lsRes.text(), {
      levelInd: ' ',
      dirInd: '+',
      fileInd: '-'
    }),
    cueSheets: (await cueRes.text()).split('===\n').reduce((acc, curr) => {
      const lines = curr.split('\n')
      const head = lines.shift()
      try {
        acc[head] = parseCue(lines)
      } catch (err) {
        console.log(err)
        console.log(lines.join('\n'))
      }
      return acc
    }, {})
  }
}

const TLMC = () => {
  const { data, error, isPending } = useAsync(fetchAndDeserialize)
  const router = useRouter()

  // For emergencies
  // return (
  //   <Page contained>
  //     <Typography variant='h5'>TLMC is offline</Typography>
  //     <Typography paragraph>(Moving files...)</Typography>
  //   </Page>
  // )

  if (isPending) {
    return (
      <Page>
        <Box pt={10} textAlign='center'>
          <CircularProgress size={100} thickness={5} />
        </Box>
      </Page>
    )
  }

  if (error) {
    console.error(error)
    return (
      <Page contained>
        <Alert
          severity='error'
          elevation={2}
          action={<Button color='inherit' onClick={() => { Router.reload() }}>Refresh Page</Button>}
        >
          <AlertTitle><b>Error</b></AlertTitle>
          Could not load directory structure.
        </Alert>
      </Page>
    )
  }

  const { ls, cueSheets } = data

  // `/api/ls` has been loaded
  // Get the path from the URL and the corresponding node
  let node = ls
  const { tlmc_path: tlmcPath } = router.query
  const breadcrumbs = [{ title: 'TLMC', href: '/tlmc' }]

  if (tlmcPath) {
    for (let i = 0; i < tlmcPath.length; ++i) {
      node = node.get(tlmcPath[i])
      if (node) {
        breadcrumbs.push({
          title: node.base,
          href: '/tlmc/[...tlmc_path]',
          as: '/tlmc' + urlEncode(node.path)
        })
      } else {
        return <Error404 />
      }
    }
  }

  // Path points to a valid node
  return (
    <>
      <Head>
        <title>{node.isRoot ? 'Touhou Lossless Music Collection' : breadcrumbs[1].title}</title>
      </Head>
      <Page breadcrumbs={breadcrumbs} ls={data} noPadding={node.isRoot} contained={!node.isRoot}>
        {(() => {
          if (node.isDirectory) {
            if (node.isRoot) {
              return (
                <DirectoryViewerVirtualized
                  title='Touhou Lossess Music Collection'
                  directory={node}
                  filter={(node) => node.isDirectory}
                />
              )
            } else if (hasAlbum(node)) {
              return (
                <>
                  {[...node.files]
                    .filter((file) => file.ext.toLowerCase() === '.cue')
                    .map((file) =>
                      <Section key={file.base}>
                        <AlbumViewer cueSheets={cueSheets} cueFile={file} />
                      </Section>
                    )}
                  <Section title='All Files'>
                    <DirectoryViewer directory={node} />
                  </Section>
                </>
              )
            } else {
              let showAlbums = false
              for (const file of node) {
                if (hasAlbum(file, true)) {
                  showAlbums = true
                  break
                }
              }
              return (
                <>
                  <Section>
                    {showAlbums && <AlbumListViewer directory={node} />}
                  </Section>
                  <Section title='All Files'>
                    <DirectoryViewer directory={node} />
                  </Section>
                </>
              )
            }
          } else {
            return (
              <Section title={node.base}>
                <FileViewer file={node} />
              </Section>
            )
          }
        })()}
      </Page>
    </>
  )
}

export default TLMC
