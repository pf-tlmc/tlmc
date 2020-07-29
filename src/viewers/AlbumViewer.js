import React from 'react'
import fetch from 'unfetch'
import { useAsync } from 'react-async'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import Alert from '@material-ui/lab/Alert'
import CoverImage from '../CoverImage'
import { playSong } from '../redux/actions'
import { urlEncode, parseCue, getAlbumInfo } from '../utils'

const useStyles = makeStyles((theme) => ({
  gridShrink: {
    flex: '0 0 auto'
  },
  gridGrow: {
    flex: '1 1 0px'
  },
  album: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.25)
    }
  },
  albumCover: {
    width: 200,
    height: 200
  },
  albumTable: {
    '& th': {
      fontWeight: 'bold',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    '& td': {
      border: 'none',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  },
  playIcon: {
    padding: theme.spacing(0.5)
  }
}))

async function fetchFile ({ file }) {
  const res = await fetch('/api/tlmc' + urlEncode(file.path))
  return res.text()
}

const AlbumViewer = connect(
  null,
  { playSong }
)(
  ({ cueFile, playSong }) => {
    const { data, error, isPending } = useAsync(fetchFile, { file: cueFile })
    const parent = cueFile.parent
    const albumInfo = getAlbumInfo(parent)
    const classes = useStyles()

    const playCue = (track) => {
      const fileName = `${track.number}. ${track.TITLE}.mp3`
      playSong(parent.get(fileName))
    }

    return (
      <Card className={classes.album} elevation={2}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item className={classes.gridShrink}>
              <CoverImage
                key={cueFile.base}
                directory={parent}
                className={classes.albumCover}
              />
            </Grid>
            <Grid item className={classes.gridGrow}>
              {albumInfo
                ? (
                  <>
                    <Typography variant='h4'>{albumInfo.title}</Typography>
                    <Typography>{albumInfo.date}</Typography>
                    {albumInfo.circleThing && <Typography>{albumInfo.circleThing}</Typography>}
                    {albumInfo.otherThing && <Typography>{albumInfo.otherThing}</Typography>}
                  </>
                )
                : <Typography variant='h5'>{cueFile.name}</Typography>}
            </Grid>
          </Grid>
        </CardContent>
        <CardContent>
          {(() => {
            if (isPending) {
              return <Box textAlign='center'><CircularProgress /></Box>
            }

            if (error) {
              return <Alert severity='error' variant='outlined'>Could not load cue file.</Alert>
            }

            let cue
            try {
              cue = parseCue(data)
            } catch (error) {
              console.error(error)
              return <Alert severity='error' variant='outlined'>Could not parse cue file.</Alert>
            }

            return (
              <Table className={classes.albumTable}>
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Performer</TableCell>
                    <TableCell />
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
                        <TableCell>
                          <IconButton onClick={playCue.bind(null, track)} className={classes.playIcon}>
                            <PlayArrowIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            )
          })()}
        </CardContent>
      </Card>
    )
  }
)

export default AlbumViewer
