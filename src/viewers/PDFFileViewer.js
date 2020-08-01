import React from 'react'
import PropTypes from 'prop-types'
import { File } from 'ls-serialize/src/structures'
import { urlEncode } from '../utils'

const PDFFileViewer = ({ file }) => {
  return (
    <iframe src={`/api/tlmc${urlEncode(file.path)}`} width='100%' height={1000} />
  )
}

PDFFileViewer.propTypes = {
  file: PropTypes.instanceOf(File).isRequired
}

export default PDFFileViewer
