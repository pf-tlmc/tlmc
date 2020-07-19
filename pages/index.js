import React from 'react'
import useSWR from 'swr'
import fetch from 'isomorphic-fetch'
import deserialize from 'ls-serialize/src/deserialize'
import { Directory } from 'ls-serialize/src/structures'

// Polyfill the path.parse() function
import path from 'path'
import pathParse from 'path-parse'
path.parse = path.parse || pathParse

function fetchLS (url) {
  return fetch(url)
    .then((res) => res.text())
    .then((text) => deserialize(text, {
      levelInd: ' ',
      dirInd: '+',
      fileInd: '-'
    }))
}

const Index = () => {
  const { data, error } = useSWR('/api/ls', fetchLS)

  if (error) {
    console.error(error)
    return <div>Error</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  // We have data!
  console.log(data)
  return (
    <ol>
      {[...data.files].map((file, index) => {
        if (file instanceof Directory) {
          return <li key={index}>{file.base}</li>
        } else {
          return null
        }
      })}
    </ol>
  )
}

export default Index
