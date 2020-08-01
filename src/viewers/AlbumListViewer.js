import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Link from '../components/Link'
import CoverImage from '../components/CoverImage'
import { urlEncode, getAlbumInfo } from '../utils'

const useClasses = makeStyles((theme) => ({
  albumList: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.25)
    }
  },
  coverImage: {
    marginRight: theme.spacing(2)
  }
}))

function collectAlbums (node, albums = []) {
  for (const file of node) {
    if (file.isFile && file.ext.toLowerCase() === '.cue') {
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
    <List component={Paper} className={classes.albumList}>
      {albums.map((album) => {
        const albumInfo = getAlbumInfo(album)
        return (
          <Link
            key={album.base}
            href='/tlmc/[...tlmc_path]'
            as={'/tlmc' + urlEncode(album.parent.path)}
            underline='none'
          >
            <ListItem button>
              <ListItemIcon>
                <CoverImage cueFile={album} size={100} className={classes.coverImage} />
              </ListItemIcon>
              <ListItemText>
                {albumInfo ? (
                  <>
                    <Typography variant='h6'>{albumInfo.title}</Typography>
                    <Typography variant='body2'>{albumInfo.date}</Typography>
                    {albumInfo.circleThing && <Typography variant='body2'>{albumInfo.circleThing}</Typography>}
                    {albumInfo.otherThing && <Typography variant='body2'>{albumInfo.otherThing}</Typography>}
                  </>
                ) : <Typography variant='h6'>{album.base}</Typography>}
              </ListItemText>
            </ListItem>
          </Link>
        )
      })}
    </List>
  )
}

export default AlbumListViewer
