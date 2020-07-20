import React from 'react'
import useSWR from 'swr'
import fetch from 'unfetch'
import { useRouter } from 'next/router'
import deserialize from 'ls-serialize/src/deserialize'
import { Directory } from 'ls-serialize/src/structures'
import Page from '../../src/Page'
import Link from '../../src/Link'
import DirectoryViewer from '../../src/DirectoryViewer'
import FileViewer from '../../src/FileViewer'
import Error404 from '../404'

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
        <div>Loading...</div>
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
