import React from 'react'
import PropTypes from 'prop-types'
import Link from './Link'

const DirectoryViewer = ({ directory }) => {
  return (
    <ul>
      {[...directory.files].map((file, index) =>
        <li key={index}>
          <Link href='/tlmc/[...tlmc_path]' as={'/tlmc' + file.path}>{file.base}</Link>
        </li>
      )}
    </ul>
  )
}

DirectoryViewer.propTypes = {
  directory: PropTypes.object.isRequired
}

export default DirectoryViewer
