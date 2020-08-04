import React, { createContext } from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import deserialize from 'ls-serialize/src/deserialize'
import { parseCue } from '../utils'

const { Provider, Consumer } = createContext()

async function fetchData () {
  const [lsData, cueData] = await Promise.all([
    fetch('/api/ls').then((res) => res.text()),
    fetch('/api/cue').then((res) => res.text())
  ])
  return {
    ls: deserialize(lsData, {
      levelInd: ' ',
      dirInd: '+',
      fileInd: '-'
    }),
    cue: cueData.split('===\n').reduce((acc, curr) => {
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

export const DataProvider = ({ children }) => {
  const { data, error, isPending } = useAsync(fetchData)

  return (
    <Provider value={{ data, error, isPending }}>
      {children}
    </Provider>
  )
}

export const DataConsumer = Consumer
