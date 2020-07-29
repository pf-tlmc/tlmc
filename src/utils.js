const IMAGE_REGEX = /\.(jpe?g|png|bmp|tiff|gif)$/i

export function isImage (node) {
  return node.isFile && IMAGE_REGEX.test(node.base)
}

export function hasAlbum (node, deep) {
  if (!node.isDirectory) return false
  for (const file of node) {
    if (file.isFile && file.ext.toLowerCase() === '.cue') {
      return true
    }
    if (deep && file.isDirectory && hasAlbum(file, deep)) {
      return true
    }
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

function parseLine (line) {
  const indent = line.search(/\S/) >> 1

  const args = []
  const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|([^\s]+)/g
  let match
  while ((match = regex.exec(line))) {
    args.push(match[1] || match[2])
  }

  return { indent, args }
}

export function parseCue (cueStr) {
  const cue = {}
  let currIndent = 0
  let node = cue

  for (const line of cueStr.split('\n')) {
    if (!line.trim()) continue
    const { indent, args: [command, ...args] } = parseLine(line)

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

    switch (command) {
      case 'REM':
        (node.REM || (node.REM = {}))[args[0]] = args[1]
        break
      case 'TITLE':
      case 'PERFORMER':
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

const ALBUM_REGEX = /^(\d{4}\.\d{2}\.\d{2})(?: \[(.+?)\])? (.+?)(?: \[(.+?)\])?$/

export function getAlbumInfo (directory) {
  const match = directory.base.match(ALBUM_REGEX)
  if (!match) return null
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
}
