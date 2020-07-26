import React from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import Router, { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import deserialize from 'ls-serialize/src/deserialize'
import Head from 'next/head'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import Page from '../../src/Page'
import DirectoryViewer from '../../src/viewers/DirectoryViewer'
import DirectoryViewerVirtualized from '../../src/viewers/DirectoryViewerVirtualized'
import AlbumViewer from '../../src/viewers/AlbumViewer'
import FileViewer from '../../src/viewers/FileViewer'
import Error404 from '../404'
import { hasAlbum, urlEncode } from '../../src/utils'

const useStyles = makeStyles((theme) => ({
  header: {
    margin: theme.spacing(2, 0, 1, 2)
  }
}))

async function fetchAndDeserialize () {
  const res = await fetch('/api/ls')
  const text = await res.text()
  return deserialize(text, {
    levelInd: ' ',
    dirInd: '+',
    fileInd: '-'
  })
}

const TLMC = () => {
  const { data, error, isPending } = useAsync(fetchAndDeserialize)
  const router = useRouter()
  const classes = useStyles()

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
      <Page>
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
      </Page>
    )
  }

  // `/api/ls` has been loaded
  // Get the path from the URL and the corresponding node
  let node = data
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
        <title>{node.isRoot ? 'TLMC' : breadcrumbs[1].title}</title>
      </Head>
      <Page breadcrumbs={breadcrumbs} ls={data} noPadding={node.isRoot}>
        {(() => {
          if (node.isDirectory) {
            if (node.isRoot) {
              return (
                <DirectoryViewerVirtualized
                  directory={node}
                  filter={(node) => node.isDirectory}
                />
              )
            } else if (hasAlbum(node)) {
              const children = []
              let index = 0
              for (const file of node) {
                if (file.ext.toLowerCase() === '.cue') {
                  children.push(<AlbumViewer key={index++} cueFile={file} />)
                }
              }
              children.push(
                <Box key='files' mt={4}>
                  <Typography variant='h5' className={classes.header}>Files</Typography>
                  <DirectoryViewer directory={node} />
                </Box>
              )
              return children
            } else {
              return <DirectoryViewer directory={node} />
            }
          } else {
            return <FileViewer file={node} />
          }
        })()}
      </Page>
    </>
  )
}

export default TLMC
