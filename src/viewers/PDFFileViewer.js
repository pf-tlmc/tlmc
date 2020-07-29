import React from 'react'
import { urlEncode } from '../utils'

const PDFFileViewer = ({ file }) => {
  return (
    <iframe src={`/api/tlmc${urlEncode(file.path)}`} width='100%' height={1000} />
  )
}

export default PDFFileViewer
