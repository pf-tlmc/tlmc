import React from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import deserialize from 'ls-serialize/src/deserialize'
import { Directory } from 'ls-serialize/src/structures'
import CircularProgress from '@material-ui/core/CircularProgress'
import Page from '../../src/Page'
import Link from '../../src/Link'
import DirectoryViewerVirtualized from '../../src/DirectoryViewerVirtualized'
import FileViewer from '../../src/FileViewer'
import Error404 from '../404'

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

  let node = data
  const { tlmc_path: tlmcPath } = router.query
  const breadcrumbs = [tlmcPath ? <Link key={0} href='/tlmc'>TLMC</Link> : <span key={0}>TLMC</span>]

  if (tlmcPath) {
    for (let i = 0; i < tlmcPath.length; ++i) {
      node = node.get(tlmcPath[i])
      if (node) {
        if (i < tlmcPath.length - 1) {
          breadcrumbs.push(<Link key={i} href='/tlmc/[...tlmc_path]' as={'/tlmc' + node.path}>{node.base}</Link>)
        } else {
          breadcrumbs.push(<span key={i}>{node.base}</span>)
        }
      } else {
        return <Error404 />
      }
    }
  }

  return (
    <Page breadcrumbs={breadcrumbs}>
      {(node instanceof Directory) ? <DirectoryViewerVirtualized directory={node} /> : <FileViewer file={node} />}
    </Page>
  )
}

export default TLMC
