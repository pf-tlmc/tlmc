import React from 'react'
import useSWR from 'swr'
import fetch from 'unfetch'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import deserialize from 'ls-serialize/src/deserialize'
import { Directory } from 'ls-serialize/src/structures'
import CircularProgress from '@material-ui/core/CircularProgress'
import Page from '../../src/Page'
import Link from '../../src/Link'
import DirectoryViewer from '../../src/DirectoryViewer'
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

let ls = null

function fetchAndDeserialize (url) {
  return ls || fetch(url)
    .then((res) => res.text())
    .then((text) => {
      ls = deserialize(text, {
        levelInd: ' ',
        dirInd: '+',
        fileInd: '-'
      })
      return ls
    })
}

const TLMC = () => {
  const { data, error } = useSWR('/api/ls', fetchAndDeserialize)
  const router = useRouter()
  const classes = useStyles()

  if (error) {
    console.error(error)
    return (
      <Page>
        <div>Error</div>
      </Page>
    )
  }

  if (!data) {
    return (
      <Page>
        <div className={classes.loading}>
          <CircularProgress size={100} thickness={5} />
        </div>
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
      {(node instanceof Directory) ? <DirectoryViewer directory={node} /> : <FileViewer file={node} />}
    </Page>
  )
}

export default TLMC
