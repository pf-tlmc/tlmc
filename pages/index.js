import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Link from '../src/Link'

const useStyles = makeStyles((theme) => ({
  greeting: {
    fontSize: 32,
    fontWeight: 'bold'
  }
}))

const Index = () => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.greeting}>Hello, World!</div>
      <Link href='/another-page'>Go to another page</Link>
    </>
  )
}

export default Index
