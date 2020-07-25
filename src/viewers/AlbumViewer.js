import React from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import parseCue from '../parse-cue'
import { isImage, urlEncode } from '../utils'

const useStyles = makeStyles((theme) => ({
  gridShrink: {
    flex: '0 0 auto'
  },
  gridGrow: {
    flex: '1 1 0px'
  },
  album: {
    margin: theme.spacing(2, 'auto'),
    padding: theme.spacing(2)
  },
  albumCover: {
    width: 150,
    height: 150
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  albumTable: {
    '& td': {
      border: 'none'
    }
  }
}))

async function fetchFile ({ file }) {
  const res = await fetch('/api/tlmc' + urlEncode(file.path))
  return res.text()
}

const COVER_REGEX = /^(image|img|jacket)_?(0*1)?.(jpe?g|png|gif)$/i
const COVER_FOLDER_REGEX = /(images?|covers?)/i

function findCoverImage (directory) {
  for (const file of directory) {
    if (file.isDirectory && COVER_FOLDER_REGEX.test(file.base)) {
      return findCoverImage(file)
    }
  }
  for (const file of directory) {
    if (file.isFile && COVER_REGEX.test(file.base)) {
      return file
    }
  }
  return [...directory.files].filter(isImage).sort((a, b) => a.base.localeCompare(b.base))[0]
}

function getInfo (albumDirectory) {
  const match = albumDirectory.base.match(/^(\d{4}\.\d{2}\.\d{2})(?: \[(.+?)\])? (.+?)(?: \[(.+?)\])?$/)
  if (!match) return null
  return {
    date: match[1],
    circleThing: match[2],
    title: match[3],
    otherThing: match[4]
  }
}

const AlbumViewer = ({ cueFile }) => {
  const { data, error, isPending } = useAsync(fetchFile, { file: cueFile })
  const parent = cueFile.parent
  const coverImage = findCoverImage(parent)
  const albumInfo = getInfo(parent)
  const classes = useStyles()

  return (
    <Container component={Paper} className={classes.album}>
      <Grid container alignItems='flex-start' spacing={4}>
        <Grid item className={classes.gridShrink}>
          <img
            src={coverImage ? `/api/tlmc${coverImage.path}?size=thumbnail` : '/images/album-placeholder.png'}
            className={classes.albumCover}
          />
        </Grid>
        <Grid item className={classes.gridGrow}>
          {albumInfo
            ? (
              <>
                <Typography variant='h5'>{albumInfo.title}</Typography>
                <Typography>{albumInfo.date}</Typography>
                {albumInfo.circleThing && <Typography>{albumInfo.circleThing}</Typography>}
                {albumInfo.otherThing && <Typography>{albumInfo.otherThing}</Typography>}
              </>
            )
            : <Typography variant='h5'>{cueFile.name}</Typography>}
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Typography>
        {isPending && <Box textAlign='center'><CircularProgress /></Box>}
        {error && <Typography>Error: Could not load cue file.</Typography>}
        {data && (() => {
          const cue = parseCue(data)

          return (
            <Table className={classes.albumTable}>
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Performer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cue._child.TRACK
                  .sort((a, b) => Number(a.number) - Number(b.number))
                  .map((track) =>
                    <TableRow key={track.number} hover>
                      <TableCell>{track.number}</TableCell>
                      <TableCell>{track.TITLE}</TableCell>
                      <TableCell>{track.PERFORMER}</TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          )
        })()}
      </Typography>
    </Container>
  )
}

export default AlbumViewer
