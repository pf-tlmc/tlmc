import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Link from './Link'
import FileIcon from './FileIcon'

const useStyles = makeStyles((theme) => ({
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
    '& li *': {
      verticalAlign: 'text-bottom'
    },
    '& a': {
      display: 'block'
    }
  }
}))

const DirectoryViewer = ({ directory }) => {
  const classes = useStyles()

  return (
    <ul className={classes.list}>
      {[...directory.files].map((file, index) =>
        <li key={index}>
          <Link href='/tlmc/[...tlmc_path]' as={'/tlmc' + file.path}>
            <FileIcon file={file} /> {file.base}
          </Link>
        </li>
      )}
    </ul>
  )
}

DirectoryViewer.propTypes = {
  directory: PropTypes.object.isRequired
}

export default DirectoryViewer
