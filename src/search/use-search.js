import { useState, useRef, useEffect } from 'react'

const CHUNK_SIZE = 25
const SEARCH_DELAY = 1

// TODO: Expanding sections while searching causes it to stop
function useSearch (ls, search) {
  const searchStatus = useRef({
    search,
    files: [...ls.files],
    index: 0,
    timeout: null
  })

  const [searchResults, setSearchResults] = useState({ circles: [], albums: [], songs: [], other: [] })

  useEffect(() => {
    if (search !== searchStatus.current.search) {
      searchStatus.current.search = search
      searchStatus.current.index = CHUNK_SIZE
      if (searchStatus.current.timeout) {
        clearTimeout(searchStatus.current.timeout)
        searchStatus.current.timeout = null
      }
      const searchResults = { circles: [], albums: [], songs: [], other: [] }
      const { files } = searchStatus.current
      for (let i = 0; i < CHUNK_SIZE && i < files.length; ++i) {
        processNode(files[i], search, searchResults)
      }
      setSearchResults(searchResults)
    } else {
      const { files, index, timeout } = searchStatus.current
      if (index < files.length && !timeout) {
        searchStatus.current.timeout = setTimeout(() => {
          for (let i = 0; i < CHUNK_SIZE && index + i < files.length; ++i) {
            processNode(files[index + i], search, searchResults)
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

function getNodeType (node) {
  if (node.isDirectory) {
    if (node.parent.isRoot) {
      return 'CIRCLE'
    } else {
      for (const file of node) {
        if (file.ext.toLowerCase() === '.tta') {
          return 'ALBUM'
        }
      }
    }
  } else {
    if (node.ext.toLowerCase() === '.mp3') {
      return 'SONG'
    }
  }

  return 'OTHER'
}

function processNode (node, search, searchResults) {
  if (node.base.toLowerCase().indexOf(search.toLowerCase()) > -1) {
    switch (getNodeType(node)) {
      case 'CIRCLE': searchResults.circles.push(node); break
      case 'ALBUM': searchResults.albums.push(node); break
      case 'SONG': searchResults.songs.push(node); break
      case 'OTHER': searchResults.other.push(node); break
    }
  }
  if (node.isDirectory) {
    for (const file of node) {
      processNode(file, search, searchResults)
    }
  }
}

export default useSearch
