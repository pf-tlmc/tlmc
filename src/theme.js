import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  typography: {
    fontSize: 16,
    fontFamily: '"Open Sans", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  overrides: {
    MuiBreadcrumbs: {
      li: {
        fontSize: '0.8rem'
      }
    }
  }
})
