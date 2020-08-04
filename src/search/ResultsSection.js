import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Section from '../components/Section'
import DirectoryViewer from '../viewers/DirectoryViewer'
import DirectoryViewerVirtualized from '../viewers/DirectoryViewerVirtualized'

const useStyles = makeStyles((theme) => ({
  expand: {
    display: 'block',
    padding: theme.spacing(1, 4)
  },
  virtualized: {
    height: 500,
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2)
  }
}))

const ResultsSection = ({ title, list, expand, setExpand }) => {
  if (list.length === 0) {
    return null
  }

  const classes = useStyles()

  return (
    <Section title={title}>
      {expand && list.length > 50 ? (
        <div className={classes.virtualized}>
          <DirectoryViewerVirtualized directory={list} />
        </div>
      ) : (
        <DirectoryViewer
          directory={expand ? list : list.slice(0, 10)}
          disablePadding
        />
      )}
      {!expand && list.length > 10 && (
        <Link onClick={() => { setExpand(!expand) }} className={classes.expand}>
          … and {(list.length - 10).toLocaleString()} more results
        </Link>
      )}
    </Section>
  )
}

export default ResultsSection
