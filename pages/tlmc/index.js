import React from 'react'
import useSWR from 'swr'
import fetch from 'unfetch'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import deserialize from 'ls-serialize/src/deserialize'
import { Directory } from 'ls-serialize/src/structures'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Button from '@material-ui/core/Button'
import Link from '../../src/Link'
import DirectoryViewer from '../../src/DirectoryViewer'
import FileViewer from '../../src/FileViewer'

let ls = null

function fetchAndDeserialize (url) {
  return ls || fetch(url)
    .then((res) => res.text())
    .then((text) => {
      ls = deserialize(text, {
        levelInd: ' ',
        dirInd: '+',
        fileInd: '-'
      })
      return ls
    })
}

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: 0
  },
  breadcrumbs: {
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(0.5, 2),
    color: theme.palette.text.primary,
    '& > ol': {
      minHeight: 27
    }
  }
}))

const TLMC = () => {
  const { data, error } = useSWR('/api/ls', fetchAndDeserialize)
  const router = useRouter()
  const classes = useStyles()

  if (error) {
    console.error(error)
    return <div>Error</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  let node = data
  const breadcrumbs = [{ base: 'TLMC' }]
  const { tlmc_path: tlmcPath } = router.query

  if (tlmcPath) {
    for (const edge of tlmcPath) {
      node = node.get(edge)
      if (node) {
        breadcrumbs.push(node)
      } else {
        return <div>404</div>
      }
    }
  }

  return (
    <>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <Button variant='contained' color='primary' disableElevation>TLMC</Button>
        </Toolbar>
        <Breadcrumbs className={classes.breadcrumbs}>
          {breadcrumbs.map((file, index) => {
            if (breadcrumbs.length > 1 && index === 0) {
              return <Link key={index} href='/tlmc'>TLMC</Link>
            } else if (index < breadcrumbs.length - 1) {
              return <Link key={index} href='/tlmc/[...tlmc_path]' as={'/tlmc' + file.path}>{file.base}</Link>
            } else {
              return <React.Fragment key={index}>{file.base}</React.Fragment>
            }
          })}
        </Breadcrumbs>
      </AppBar>
      <Box mt={12}>
        {(node instanceof Directory)
          ? <DirectoryViewer directory={node} />
          : <FileViewer file={node} />}
      </Box>
    </>
  )
}

export default TLMC
