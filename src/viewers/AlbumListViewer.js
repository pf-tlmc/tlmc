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
  root: {
    padding: 0
  },
  listItem: {
    '& > *': {
      margin: 0
    }
  },
  coverImage: {
    margin: theme.spacing(0.25, 2, 0.25, 0)
  },
  title: {
    lineHeight: 1.1,
    margin: theme.spacing(0.5, 0)
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
    <List component={Paper} className={classes.root}>
      {albums.map((album) => {
        const albumInfo = getAlbumInfo(album)
        return (
          <Link
            key={album.path}
            href='/tlmc/[...tlmc_path]'
            as={'/tlmc' + urlEncode(album.parent.path)}
            underline='none'
          >
            <ListItem button alignItems='flex-start' className={classes.listItem}>
              <ListItemIcon>
                <CoverImage cueFile={album} size={100} className={classes.coverImage} />
              </ListItemIcon>
              <ListItemText>
                {albumInfo ? (
                  <>
                    <Typography variant='h6' className={classes.title}>{albumInfo.title}</Typography>
                    <Typography variant='body2'>{albumInfo.date}</Typography>
                    {albumInfo.circleThing && <Typography variant='body2'>{albumInfo.circleThing}</Typography>}
                    {albumInfo.otherThing && <Typography variant='body2'>{albumInfo.otherThing}</Typography>}
                  </>
                ) : (
                  <Typography variant='h6' className={classes.title}>{album.base}</Typography>
                )}
              </ListItemText>
            </ListItem>
          </Link>
        )
      })}
    </List>
  )
}

export default AlbumListViewer
