import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized-auto-sizer'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import Progress from './Progress'

const useStyles = makeStyles((theme) => ({
  player: {
    borderTop: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(2)
  },
  gridShrink: {
    flex: '0 0 auto'
  },
  gridGrow: {
    flex: '1 1 0px'
  },
  playIcon: {
    fontSize: '1.5em'
  }
}))

const MusicPlayer = () => {
  const classes = useStyles()

  return (
    <div className={classes.player}>
      <Container>
        <Grid container spacing={2}>
          <Grid item className={classes.gridShrink}>
            <img src='http://localhost:3000/api/tlmc/[%E5%87%8B%E5%8F%B6%E6%A3%95]/2010.12.30%20[RDWL-0004]%20%E5%BB%BB%20[C79]/Image0001.JPG?size=thumbnail' width={150} height={150} />
          </Grid>
          <Grid item className={classes.gridGrow}>
            <AutoSizer>
              {({ width, height }) =>
                <div style={{ width, height }}>
                  <Progress value={0.7} />
                  <Box textAlign='center' pt={1.5}>
                    <Typography variant='h6' noWrap gutterBottom>ウッデン・シューズ・ウィズ・リトル・エレガンス</Typography>
                    <IconButton><SkipPreviousIcon /></IconButton>
                    <IconButton><PlayArrowIcon fontSize='large' /></IconButton>
                    <IconButton><SkipNextIcon /></IconButton>
                  </Box>
                </div>}
            </AutoSizer>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default MusicPlayer
