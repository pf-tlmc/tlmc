import React from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import deserialize from 'ls-serialize/src/deserialize'
import CircularProgress from '@material-ui/core/CircularProgress'
import Page from '../../src/Page'
import Link from '../../src/Link'
import DirectoryViewer from '../../src/DirectoryViewer'
import FileViewer from '../../src/FileViewer'
import Error404 from '../404'
import urlEncode from '../../src/urlEncode'

const useStyles = makeStyles((theme) => ({
  loading: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
    textAlign: 'center'
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
        <div className={classes.loading}>
          <CircularProgress size={100} thickness={5} />
        </div>
      </Page>
    )
  }

  if (error) {
    console.error(error)
    return (
      <Page>
        <div>Error</div>
      </Page>
    )
  }

  // `/api/ls` has been loaded
  // Get the path from the URL and the corresponding node
  let node = data
  const { tlmc_path: tlmcPath } = router.query
  const breadcrumbs = [tlmcPath ? <Link key={0} href='/tlmc'>TLMC</Link> : <span key={0}>TLMC</span>]

  if (tlmcPath) {
    for (let i = 0; i < tlmcPath.length; ++i) {
      node = node.get(tlmcPath[i])
      if (node) {
        if (i < tlmcPath.length - 1) {
          breadcrumbs.push(<Link key={i} href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(node.path)}>{node.base}</Link>)
        } else {
          breadcrumbs.push(<span key={i}>{node.base}</span>)
        }
      } else {
        return <Error404 />
      }
    }
  }

  // Path points to a valid node
  return (
    <Page breadcrumbs={breadcrumbs}>
      {node.isDirectory
        ? <DirectoryViewer directory={node} />
        : <FileViewer file={node} />}
    </Page>
  )
}

export default TLMC
