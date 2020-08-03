import fs from 'fs'
import http from 'http'
import lsSerialize from 'ls-serialize'
import { urlEncode, getNodeType } from '../../src/utils'
import COVER_IMAGE_MAP from '../../src/cover-image-map'

const LS_CACHE = './.cache/ls'
const DEFAULT_THUMBNAIL = './public/images/album-placeholder.png'
const COVER_REGEX = /^(image|img|jacket).*0*1\.(jpe?g|png|gif)$/i
const COVER_FOLDER_REGEX = /^(images?|covers?|scans?)$/i
const ls = lsSerialize.deserialize(fs.readFileSync(LS_CACHE).toString())

function sendDefault (res) {
  fs.createReadStream(DEFAULT_THUMBNAIL).pipe(res)
}

function crawlLs (path) {
  let node = ls
  const edges = path.split('/')
  edges.shift()

  for (const edge of edges) {
    node = node.isDirectory && node.get(edge)
    if (!node) return null
  }
  return node
}

function getCoverImage (cueFile) {
  const directory = cueFile.isDirectory ? cueFile : cueFile.parent

  // First try using the map
  const path = COVER_IMAGE_MAP[cueFile.path]
  if (path) {
    let node = directory
    for (const edge of path.split('/')) {
      if (edge === '..') {
        node = node.parent
      } else {
        node = node.get(edge)
      }
    }
    return node
  }

  // Then try images in current folder
  for (const file of directory) {
    if (file.isFile && COVER_REGEX.test(file.base)) {
      return file
    }
  }

  // Then try any appropriately named directories
  for (const file of directory) {
    if (file.isDirectory && COVER_FOLDER_REGEX.test(file.base)) {
      return getCoverImage(file, true)
    }
  }

  // Use any image in the current directory, sorted by name
  const img = [...directory.files]
    .filter((file) => getNodeType(file) === 'IMAGE')
    .sort((a, b) => a.base.localeCompare(b.base))[0]
  if (img) {
    return img
  }

  // Try any other directories in here
  for (const file of directory) {
    if (file.isDirectory) {
      const img = getCoverImage(file)
      if (img) {
        return img
      }
    }
  }
}

function thumbnail (req, res) {
  const { cue } = req.query

  // Check cue path
  const cueFile = cue && crawlLs(cue)
  if (!cueFile) return sendDefault(res)

  // Get the cover image
  const coverImage = getCoverImage(cueFile)
  if (!coverImage) return sendDefault(res)

  return http.get(
    `${process.env.TLMC_SERVE}/tlmc${urlEncode(coverImage.path)}?size=thumbnail`,
    (httpRes) => {
      res.writeHead(httpRes.statusCode, httpRes.headers)
      httpRes.pipe(res)
    }
  )
}

export default thumbnail
export const config = {
  api: {
    externalResolver: true
  }
}
