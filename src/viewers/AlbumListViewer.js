import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from '../Link'
import CoverImage from '../CoverImage'
import { urlEncode, hasAlbum, getAlbumInfo } from '../utils'

const useClasses = makeStyles((theme) => ({
  albumList: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.25)
    }
  },
  coverImage: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(2)
  }
}))

function collectAlbums (node, albums = []) {
  for (const file of node) {
    if (hasAlbum(file)) {
      albums.push(file)
    }
    if (file.isDirectory) {
      collectAlbums(file, albums)
    }
  }
  return albums
}

const AlbumListViewer = ({ directory }) => {
  const classes = useClasses()
  const albums = collectAlbums(directory)

  return (
    <Container>
      <List component={Paper} className={classes.albumList}>
        {albums.map((directory) => {
          const albumInfo = getAlbumInfo(directory)
          return (
            <Link key={directory.base} href='/tlmc/[...tlmc_path]' as={'/tlmc' + urlEncode(directory.path)}>
              <ListItem button>
                <ListItemIcon>
                  <CoverImage directory={directory} className={classes.coverImage} />
                </ListItemIcon>
                <ListItemText>
                  {albumInfo
                    ? (
                      <>
                        <Typography variant='h6'>{albumInfo.title}</Typography>
                        <Typography variant='body2'>{albumInfo.date}</Typography>
                        {albumInfo.circleThing && <Typography variant='body2'>{albumInfo.circleThing}</Typography>}
                        {albumInfo.otherThing && <Typography variant='body2'>{albumInfo.otherThing}</Typography>}
                      </>
                    )
                    : <Typography variant='h6'>{directory.base}</Typography>}
                </ListItemText>
              </ListItem>
            </Link>
          )
        })}
      </List>
    </Container>
  )
}

export default AlbumListViewer
