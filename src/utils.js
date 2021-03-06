import { useReducer } from 'react'

const IMAGE_REGEX = /\.(jpe?g|png|bmp|tiff|gif)$/i
const ALBUM_REGEX = /\.cue$/i
const SONG_REGEX = /\.mp3$/i

export function getNodeType (node) {
  if (node.isDirectory) {
    if (!node.isRoot && node.parent.isRoot) return 'CIRCLE'
  }
  if (node.isFile) {
    if (IMAGE_REGEX.test(node.ext)) return 'IMAGE'
    if (ALBUM_REGEX.test(node.ext)) return 'ALBUM'
    if (SONG_REGEX.test(node.ext)) return 'SONG'
  }
  return 'UNKNOWN'
}

export function hasAlbum (node, deep) {
  if (!node.isDirectory) return false
  for (const file of node) {
    if (getNodeType(file) === 'ALBUM') return true
    if (deep && file.isDirectory && hasAlbum(file, deep)) return true
  }
  return false
}

// This fixes the `#` problem in `[#ゆうかりんちゃんねる]`
// Make sure this matches the function in create-sitemap.js
// TODO: API still isn't happy
export function urlEncode (url) {
  return url.replace(/#/g, '%23')
  // return url.split('/').map(encodeURIComponent).join('/')
}

export function parseCue (cueStr) {
  const cue = {}
  let currIndent = 0
  let node = cue

  for (const line of Array.isArray(cueStr) ? cueStr : cueStr.split('\n')) {
    if (!line.trim()) continue

    // Parse line
    const indent = line.search(/\S/) >> 1
    const tokens = []
    const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|([^\s]+)/g
    let match
    while ((match = regex.exec(line))) {
      tokens.push(match[1] || match[2])
    }
    const [command, ...args] = tokens

    // Go to level
    while (indent < currIndent) {
      node = node._parent
      --currIndent
    }
    if (indent > currIndent) {
      node = node.TRACK
        ? node.TRACK[node.TRACK.length - 1]
        : node._child || (node._child = { _parent: node })
      currIndent = indent
    }

    // Execute command
    switch (command) {
      case 'REM':
        (node.REM || (node.REM = {}))[args[0]] = args[1]
        break
      case 'TITLE':
      case 'PERFORMER':
      case 'FLAGS':
      case 'INDEX':
        node[command] = args[0]
        break
      case 'FILE':
        node[command] = {
          name: args[0],
          type: args[1]
        }
        break
      case 'TRACK':
        (node.TRACK || (node.TRACK = [])).push({
          number: args[0],
          type: args[1],
          _parent: node
        })
        break
      default:
        throw new Error(`Unkown command: ${command}`)
    }
  }

  return cue
}

const ALBUM_TITLE_REGEX = /^(\d{4}\.\d{2}\.\d{2})(?: \[(.+?)\])? (.+?)(?: \[(.+?)\])?$/

export function getAlbumInfo (cueFile) {
  const match = cueFile.parent.base.match(ALBUM_TITLE_REGEX)
  if (!match) {
    console.error('Could not parse album info: ', cueFile)
    return null
  }

  return {
    date: match[1],
    circleThing: match[2],
    title: match[3],
    otherThing: match[4]
  }
}

export function getFileName (track) {
  return `${track.number}. ${track.TITLE}.mp3`
    .replace(/\?/g, '')
    .replace(/[/\\:|]/g, '-')
    .replace(/[<>\t]/g, '_')
    .replace(/\*/g, 'x')
}

export function useForceUpdate () {
  return useReducer(x => x + 1, 0)[1]
}

export function shuffle (array) {
  let counter = array.length
  while (counter > 0) {
    const index = Math.random() * counter-- | 0
    const temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }
  return array
}
