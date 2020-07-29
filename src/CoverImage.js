import React from 'react'
import { isImage } from './utils'
import COVER_IMAGE_MAP from './cover-image-map'

const COVER_REGEX = /^(image|img|jacket).*0*1\.(jpe?g|png|gif)$/i
const COVER_FOLDER_REGEX = /^(images?|covers?|scans?)$/i

export function findCoverImage (directory) {
  // First try using the map
  const path = COVER_IMAGE_MAP[directory.path]
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
      return findCoverImage(file)
    }
  }

  // Use any image in the current directory, sorted by name
  const img = [...directory.files].filter(isImage).sort((a, b) => a.base.localeCompare(b.base))[0]
  if (img) {
    return img
  }

  // Try any other directories in here
  for (const file of directory) {
    if (file.isDirectory) {
      const img = findCoverImage(file)
      if (img) {
        return img
      }
    }
  }
}

const CoverImage = ({ directory, ...props }) => {
  const coverImage = directory && findCoverImage(directory)
  const src = coverImage ? `/api/tlmc${coverImage.path}?size=thumbnail` : '/images/album-placeholder.png'
  return (
    <img src={src} {...props} />
  )
}

export default CoverImage
