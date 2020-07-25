const IMAGE_REGEX = /\.(jpe?g|png|bmp|tiff|gif)$/i

export function isImage (node) {
  console.log(node.base)
  return node.isFile && IMAGE_REGEX.test(node.base)
}

export function isAlbum (node) {
  if (!node.isDirectory) return false
  for (const file of node) {
    if (file.isFile && file.ext.toLowerCase() === '.cue') {
      return true
    }
  }
  return false
}
