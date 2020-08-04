import React from 'react'
import PropTypes from 'prop-types'
import { File } from 'ls-serialize/src/structures'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import GetAppIcon from '@material-ui/icons/GetApp'
import { DataConsumer } from '../components/DataContext'
import CoverImage from '../components/CoverImage'
import { playSong, queueSong } from '../redux/actions'
import { urlEncode, getAlbumInfo, getFileName, shuffle } from '../utils'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.25)
    }
  },
  image: {
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      textAlign: 'center'
    }
  },
  title: {
    flex: '1 1 0px'
  },
  table: {
    minWidth: 500,
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
    '& button': {
      margin: theme.spacing(2, 2, 0, 0)
    }
  },
  iconButtons: {
    whiteSpace: 'nowrap',
    '& button': {
      padding: theme.spacing(1),
      margin: theme.spacing(0, 0.5)
    }
  }
}))

const AlbumViewer = connect(
  (state) => ({ song: state.musicPlayer.playlist[state.musicPlayer.index] }),
  { playSong, queueSong }
)(
  ({ cueFile, song, playSong, queueSong }) => {
    const classes = useStyles()

    return (
      <DataConsumer>
        {({ data: { cue } }) => {
          const albumInfo = getAlbumInfo(cueFile)
          const parent = cueFile.parent
          const cueSheet = cue[cueFile.path]

          const playTrack = (track) => {
            playSong(parent.get(getFileName(track)))
          }

          const queueTrack = (track) => {
            if (song) {
              queueSong(parent.get(getFileName(track)))
            } else {
              song = true // Let queueAll know that a song has been queued already
              playSong(parent.get(getFileName(track)))
            }
          }

          const queueAll = () => {
            cueSheet._child.TRACK.forEach(queueTrack)
          }

          const shuffleAll = () => {
            shuffle(cueSheet._child.TRACK).forEach(queueTrack)
          }

          return (
            <Card className={classes.root} elevation={2}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item className={classes.image}>
                    <CoverImage key={cueFile.base} cueFile={cueFile} />
                  </Grid>
                  <Grid item className={classes.title}>
                    {albumInfo ? (
                      <>
                        <Typography variant='h4'>{albumInfo.title}</Typography>
                        <Typography>{albumInfo.date}</Typography>
                        {albumInfo.circleThing && <Typography>{albumInfo.circleThing}</Typography>}
                        {albumInfo.otherThing && <Typography>{albumInfo.otherThing}</Typography>}
                      </>
                    ) : (
                      <Typography variant='h4'>{cueFile.name}</Typography>
                    )}
                    <div className={classes.buttons}>
                      <Button variant='outlined' onClick={queueAll}>Queue All</Button>
                      <Button variant='outlined' onClick={shuffleAll}>Shuffle All</Button>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
              <CardContent>
                <TableContainer>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell align='center'>Index</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Performer</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cueSheet._child.TRACK.map((track) =>
                        <TableRow key={track.number} hover>
                          <TableCell align='center'>{track.number}</TableCell>
                          <TableCell>{track.TITLE}</TableCell>
                          <TableCell>{track.PERFORMER}</TableCell>
                          <TableCell align='center' className={classes.iconButtons}>
                            <Tooltip title='Play'>
                              <IconButton onClick={playTrack.bind(null, track)}>
                                <PlayArrowIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Queue'>
                              <IconButton onClick={queueTrack.bind(null, track)}>
                                <QueueMusicIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Download'>
                              <Link download href={`/api/tlmc${urlEncode([parent.path, getFileName(track)].join('/'))}`}>
                                <IconButton>
                                  <GetAppIcon />
                                </IconButton>
                              </Link>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )
        }}
      </DataConsumer>
    )
  }
)

AlbumViewer.propTypes = {
  cueFile: PropTypes.instanceOf(File).isRequired
}

export default AlbumViewer
