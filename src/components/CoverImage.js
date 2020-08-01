import React from 'react'
import PropTypes from 'prop-types'
import { File } from 'ls-serialize/src/structures'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { urlEncode, isImage } from '../utils'
import COVER_IMAGE_MAP from '../cover-image-map'

const COVER_REGEX = /^(image|img|jacket).*0*1\.(jpe?g|png|gif)$/i
const COVER_FOLDER_REGEX = /^(images?|covers?|scans?)$/i
const DEFAULT_IMAGE = '/images/album-placeholder.png'

const useStyles = makeStyles((theme) => ({
  coverImage: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    backgroundColor: theme.palette.action.hover
  }
}))

function findCoverImage (cueFile) {
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
      return findCoverImage(file, true)
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

const CoverImage = ({ cueFile, size = 200, imageProps, className, ...props }) => {
  const classes = useStyles({ size })
  const coverImage = cueFile && findCoverImage(cueFile)
  const src = coverImage ? `/api/tlmc${urlEncode(coverImage.path)}?size=thumbnail` : DEFAULT_IMAGE

  return (
    <div className={clsx(classes.coverImage, className)} {...props}>
      <img src={src} width={size} height={size} {...imageProps} />
    </div>
  )
}

CoverImage.propTypes = {
  cueFile: PropTypes.instanceOf(File),
  size: PropTypes.number
}

export default CoverImage
