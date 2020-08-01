import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'unfetch'
import { File } from 'ls-serialize/src/structures'
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
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import Alert from '@material-ui/lab/Alert'
import CoverImage from '../components/CoverImage'
import { playSong, queueSong } from '../redux/actions'
import { urlEncode, parseCue, getAlbumInfo, getFileName } from '../utils'

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
    width: 150,
    height: 150
  },
  albumTable: {
    '& th': {
      fontWeight: 'bold',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    '& td': {
      border: 'none',
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    }
  },
  buttons: {
    whitespace: 'noWrap',
    '& button': {
      padding: theme.spacing(1),
      margin: theme.spacing(0, 0.5)
    }
  }
}))

async function fetchFile ({ file }) {
  const res = await fetch('/api/tlmc' + urlEncode(file.path))
  return res.text()
}

const AlbumViewer = connect(
  (state) => ({ song: state.musicPlayer.playlist[state.musicPlayer.index] }),
  { playSong, queueSong }
)(
  ({ cueFile, song, playSong, queueSong }) => {
    const { data, error, isPending } = useAsync(fetchFile, { file: cueFile })
    const parent = cueFile.parent
    const albumInfo = getAlbumInfo(cueFile)
    const classes = useStyles()

    const playCue = (track) => {
      playSong(parent.get(getFileName(track)))
    }

    const queueCue = (track) => {
      if (song) {
        queueSong(parent.get(getFileName(track)))
      } else {
        song = true // Let queueAll know that a song has been queued already
        playSong(parent.get(getFileName(track)))
      }
    }

    return (
      <Card className={classes.album} elevation={2}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item className={classes.gridShrink}>
              <CoverImage
                key={cueFile.base}
                cueFile={cueFile}
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
                : <Typography variant='h4'>{cueFile.name}</Typography>}
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

            const queueAll = () => {
              cue._child.TRACK
                .sort((a, b) => Number(a.number) - Number(b.number))
                .forEach(queueCue)
            }

            return (
              <Table className={classes.albumTable}>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Index</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Performer</TableCell>
                    <TableCell align='center'><Button variant='outlined' onClick={queueAll}>Queue All</Button></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cue._child.TRACK
                    .sort((a, b) => Number(a.number) - Number(b.number))
                    .map((track) =>
                      <TableRow key={track.number} hover>
                        <TableCell align='center'>{track.number}</TableCell>
                        <TableCell>{track.TITLE}</TableCell>
                        <TableCell>{track.PERFORMER}</TableCell>
                        <TableCell align='center' className={classes.buttons}>
                          <IconButton onClick={playCue.bind(null, track)}>
                            <PlayArrowIcon />
                          </IconButton>
                          <IconButton onClick={queueCue.bind(null, track)}>
                            <QueueMusicIcon />
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

AlbumViewer.propTypes = {
  cueFile: PropTypes.instanceOf(File).isRequired
}

export default AlbumViewer
