import { useState, useRef, useEffect } from 'react'
import japanese from 'japanese'
import { getNodeType } from '../utils'

const CHUNK_SIZE = 25
const SEARCH_DELAY = 1
const JAPANESE_REGEX = /[ぁ-んァ-ン]+/g

// TODO: Expanding sections while searching causes it to stop
function useSearch (ls, search, options) {
  const searchStatus = useRef({
    search,
    options,
    files: [...ls.files],
    index: 0,
    timeout: null
  })

  const [searchResults, setSearchResults] = useState({
    circles: [],
    albums: [],
    songs: [],
    other: []
  })

  useEffect(() => {
    if (search !== searchStatus.current.search || options !== searchStatus.current.options) {
      searchStatus.current.search = search
      searchStatus.current.options = options
      searchStatus.current.index = CHUNK_SIZE
      if (searchStatus.current.timeout) {
        clearTimeout(searchStatus.current.timeout)
        searchStatus.current.timeout = null
      }
      const searchResults = { circles: [], albums: [], songs: [], other: [] }
      const { files } = searchStatus.current
      for (let i = 0; i < CHUNK_SIZE && i < files.length; ++i) {
        processNode(files[i], search, searchResults, options)
      }
      setSearchResults(searchResults)
    } else {
      const { files, index, timeout } = searchStatus.current
      if (index < files.length && !timeout) {
        searchStatus.current.timeout = setTimeout(() => {
          const normalizedSearch = normalize(search, options)
          for (let i = 0; i < CHUNK_SIZE && index + i < files.length; ++i) {
            processNode(files[index + i], normalizedSearch, searchResults, options)
          }
          searchStatus.current.index += CHUNK_SIZE
          searchStatus.current.timeout = null
          setSearchResults({ ...searchResults })
        }, SEARCH_DELAY)
      }
    }

    return () => {
      searchStatus.current.timeout && clearTimeout(searchStatus.current.timeout)
    }
  })

  const { index, files } = searchStatus.current
  return [searchResults, Math.min(index / files.length, 1)]
}

function processNode (node, search, searchResults, options) {
  if (nodeMatches(node, search, options)) {
    switch (getNodeType(node)) {
      case 'CIRCLE':
        searchResults.circles.push(node)
        break
      case 'ALBUM':
        searchResults.albums.push(node)
        break
      case 'SONG':
        searchResults.songs.push(node)
        break
      default:
        searchResults.other.push(node)
        break
    }
  }
  if (node.isDirectory) {
    for (const file of node) {
      processNode(file, search, searchResults, options)
    }
  }
}

function nodeMatches (node, search, options) {
  const fileName = normalize(node.base, options)

  if (options.metadata) {
    if (fileName.indexOf(search) > -1) return true
    return metaMatches(node.meta, search, options)
  } else {
    return fileName.indexOf(search) > -1
  }
}

function metaMatches (metaNode, search, options) {
  for (const key in metaNode) {
    if (key === 'REM') {
      metaMatches(metaNode.REM, search, options)
    } else if (key === key.toUpperCase()) {
      const value = metaNode[key]
      if (typeof value === 'string' && normalize(value, options).indexOf(search) > -1) {
        return true
      }
    }
  }
  return false
}

function normalize (str, options) {
  if (options.romaji) {
    return str.replace(JAPANESE_REGEX, (chars) => japanese.romanize(chars)).toLowerCase()
  }
  return str.toLowerCase()
}

export default useSearch
