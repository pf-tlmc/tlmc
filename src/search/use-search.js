import { useState, useRef, useEffect } from 'react'
import hepburn from 'hepburn'
import { getNodeType } from '../utils'

const CHUNK_TIME = 25

// TODO: Expanding sections while searching causes it to stop
function useSearch (ls, search, options) {
  const searchStatus = useRef({
    search,
    options,
    files: [...ls.files],
    index: 0,
    timeout: null,
    start: 0
  })

  const [searchResults, setSearchResults] = useState({
    circles: [],
    albums: [],
    songs: [],
    other: []
  })

  useEffect(() => {
    function tick (searchResults) {
      const start = Date.now()
      const { files } = searchStatus.current
      const normalizedSearch = normalize(search, options)

      let { index } = searchStatus.current
      while (index < files.length && Date.now() - start < CHUNK_TIME) {
        processNode(files[index], normalizedSearch, searchResults, options)
        ++index
      }

      searchStatus.current.index = index
      searchStatus.current.timeout = null
      console.log(Date.now() - searchStatus.current.start)
      setSearchResults({ ...searchResults })
    }

    if (search !== searchStatus.current.search || options !== searchStatus.current.options) {
      searchStatus.current.search = search
      searchStatus.current.options = options
      searchStatus.current.index = 0
      searchStatus.current.start = Date.now()
      if (searchStatus.current.timeout) {
        clearTimeout(searchStatus.current.timeout)
        searchStatus.current.timeout = null
      }
      tick({ circles: [], albums: [], songs: [], other: [] })
    } else {
      const { index, files, timeout } = searchStatus.current
      if (index < files.length && !timeout) {
        searchStatus.current.timeout = setTimeout(() => {
          tick(searchResults)
        }, 1)
      }
    }

    return () => {
      searchStatus.current.timeout && clearTimeout(searchStatus.current.timeout)
    }
  })

  return [searchResults, searchStatus.current.index / searchStatus.current.files.length]
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
  if (fileName.indexOf(search) > -1) {
    return true
  } else {
    return metaMatches(node.meta, search, options)
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
    return hepburn.fromKana(str).toLowerCase()
  }
  return str.toLowerCase()
}

export default useSearch
