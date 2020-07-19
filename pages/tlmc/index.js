import React from 'react'
import useSWR from 'swr'
import fetch from 'unfetch'
import { useRouter } from 'next/router'
import deserialize from 'ls-serialize/src/deserialize'
import { Directory } from 'ls-serialize/src/structures'
import DirectoryViewer from '../../src/DirectoryViewer'
import FileViewer from '../../src/FileViewer'

function fetchAndDeserialize (url) {
  return fetch(url)
    .then((res) => res.text())
    .then((text) => deserialize(text, {
      levelInd: ' ',
      dirInd: '+',
      fileInd: '-'
    }))
}

const TLMC = () => {
  const { data, error } = useSWR('/api/ls', fetchAndDeserialize)
  const router = useRouter()

  if (error) {
    console.error(error)
    return <div>Error</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  const { tlmc_path: tlmcPath } = router.query

  let node = data
  if (tlmcPath) {
    for (const edge of tlmcPath) {
      node = node.get(edge)
      if (!node) {
        return <div>404</div>
      }
    }
  }

  if (node instanceof Directory) {
    return <DirectoryViewer directory={node} />
  } else {
    return <FileViewer file={node} />
  }
}

export default TLMC
