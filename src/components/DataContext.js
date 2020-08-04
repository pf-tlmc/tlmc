import React, { createContext } from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import deserialize from 'ls-serialize/src/deserialize'
import { parseCue, getNodeType, getFileName } from '../utils'

const { Provider, Consumer } = createContext()

async function fetchData () {
  const [lsData, cueData] = await Promise.all([
    fetch('/api/ls').then((res) => res.text()),
    fetch('/api/cue').then((res) => res.text())
  ])

  const ls = deserialize(lsData, {
    levelInd: ' ',
    dirInd: '+',
    fileInd: '-'
  })

  const cue = cueData.split('===\n').reduce((acc, curr) => {
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

  // Attach metadata
  ;(function attach (node = ls) {
    for (const file of node) {
      if (file.isDirectory) {
        attach(file)
      } else if (getNodeType(file) === 'ALBUM') {
        const cueSheet = cue[file.path]
        const parent = file.parent
        if (!cueSheet) {
          console.error(`Missing cue sheet for ${file.path}`)
        } else {
          file.meta = cueSheet
          for (const track of cueSheet._child.TRACK) {
            const audioFile = parent.get(getFileName(track))
            if (!audioFile) {
              console.error(`Audio file not found at ${file.path}:`, track)
            } else if (audioFile.meta) {
              console.error(`Duplicate file found at ${file.path}:`, track)
            } else {
              audioFile.meta = track
            }
          }
        }
      }
    }
  })()

  return { ls, cue }
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
