import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from './Link'

const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    background: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    padding: theme.spacing(0.5, 4),
    color: theme.palette.text.primary,
    '& > ol': {
      minHeight: 27
    }
  }
}))

const Breadcrumbs = ({ breadcrumbs }) => {
  const classes = useStyles()

  return (
    <MuiBreadcrumbs className={classes.breadcrumbs}>
      {breadcrumbs.map((crumb, index) =>
        index < breadcrumbs.length - 1
          ? <Link key={index} href={crumb.href} as={crumb.as}>{crumb.title}</Link>
          : <span key={index}>{crumb.title}</span>
      )}
    </MuiBreadcrumbs>
  )
}

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      as: PropTypes.string
    }).isRequired
  ).isRequired
}

export default Breadcrumbs
