import React from 'react'
import Container from '../Container'
import urlEncode from '../urlEncode'

const PDFFileViewer = ({ file }) => {
  return (
    <Container title={file.base}>
      <iframe src={'/api/tlmc' + urlEncode(file.path)} width='100%' height={1000} />
    </Container>
  )
}

export default PDFFileViewer
