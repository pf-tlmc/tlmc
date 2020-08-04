import React from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from './Link'

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(0.5, 4),
    color: theme.palette.getContrastText(theme.palette.background.default)
  }
}))

const Breadcrumbs = ({ breadcrumbs }) => {
  const classes = useStyles()
  const router = useRouter()
  const { tlmc_path: tlmcPath } = router.query

  if (!tlmcPath) return null

  let currLocation = '/tlmc'
  const crumbs = [{ title: 'TLMC', href: currLocation }]
    .concat(tlmcPath.map((path) => ({
      title: decodeURIComponent(path),
      href: '/tlmc/[...tlmc_path]',
      as: (currLocation += `/${path}`)
    })))

  return (
    <MuiBreadcrumbs className={classes.root}>
      {crumbs.map((crumb, index) =>
        index < tlmcPath.length
          ? <Link key={index} href={crumb.href} as={crumb.as}>{crumb.title}</Link>
          : <span key={index}>{crumb.title}</span>
      )}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
