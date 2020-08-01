import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import MuiLink from '@material-ui/core/Link'

const NextComposed = forwardRef(({ href, as, ...other }, ref) => {
  return (
    <NextLink href={href} as={as}>
      <a ref={ref} {...other} />
    </NextLink>
  )
})

NextComposed.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  prefetch: PropTypes.bool
}

const Link = forwardRef((props, ref) => {
  const {
    href,
    activeClassName = 'active',
    className: classNameProps,
    naked,
    ...other
  } = props

  const router = useRouter()
  const pathname = typeof href === 'string' ? href : href.pathname
  const className = clsx(classNameProps, router.pathname === pathname && activeClassName && activeClassName)

  if (naked) {
    return <NextComposed ref={ref} href={href} className={className} {...other} />
  } else {
    return <MuiLink ref={ref} component={NextComposed} href={href} className={className} {...other} />
  }
})

Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  naked: PropTypes.bool,
  activeClassName: PropTypes.string
}

export default Link
