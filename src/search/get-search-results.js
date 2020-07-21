function isCircle (node) {
  return node.isDirectory && node.parent.isRoot
}

function isAlbum (node) {
  if (node.isFile) {
    return false
  }
  for (const file of node) {
    if (file.ext.toLowerCase() === '.tta') {
      return true
    }
  }
}

function isSong (node) {
  return node.isFile && node.ext.toLowerCase() === '.mp3'
}

function sorter (nodeA, nodeB) {
  return nodeA.base.localeCompare(nodeB.base)
}

function getSearchResults (search, ls) {
  search = search.toLowerCase()
  const circles = []
  const albums = []
  const songs = []
  const other = []

  ;(function processNode (node) {
    for (const file of node) {
      if (file.base.toLowerCase().indexOf(search) > -1) {
        if (isCircle(file)) {
          circles.push(file)
        } else if (isSong(file)) {
          songs.push(file)
        } else if (isAlbum(file)) {
          albums.push(file)
        } else {
          other.push(file)
        }
      }
      if (file.isDirectory) {
        processNode(file)
      }
    }
  })(ls)

  return {
    circles: circles.sort(sorter),
    albums: albums.sort(sorter),
    songs: songs.sort(sorter),
    other: other.sort(sorter)
  }
}

export default getSearchResults
