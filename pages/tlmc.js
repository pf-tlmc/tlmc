import React from 'react'
import useSWR from 'swr'
import fetch from 'unfetch'
import deserialize from 'ls-serialize/src/deserialize'
import { Directory } from 'ls-serialize/src/structures'

const TLMC = () => {
  const { data, error } = useSWR('/api/ls', (url) => fetch(url).then((res) => res.text()))

  if (error) {
    console.error(error)
    return <div>Error</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  const root = deserialize(data, {
    levelInd: ' ',
    dirInd: '+',
    fileInd: '-'
  })

  return (
    <ol>
      {[...root.files].map((file, index) => {
        if (file instanceof Directory) {
          return <li key={index}>{file.base}</li>
        } else {
          return null
        }
      })}
    </ol>
  )
}

export default TLMC
