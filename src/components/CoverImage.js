import React from 'react'
import PropTypes from 'prop-types'
import { File } from 'ls-serialize/src/structures'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  coverImage: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    backgroundColor: theme.palette.action.hover
  }
}))

const CoverImage = ({ cueFile, size = 200, imageProps, className, ...props }) => {
  const classes = useStyles({ size })

  return (
    <div className={clsx(classes.coverImage, className)} {...props}>
      <img
        src={`/api/thumbnail?cue=${urlEncode(cueFile.path)}`}
        width={size}
        height={size}
        {...imageProps}
      />
    </div>
  )
}

CoverImage.propTypes = {
  cueFile: PropTypes.instanceOf(File),
  size: PropTypes.number,
  imageProps: PropTypes.object
}

export default CoverImage
