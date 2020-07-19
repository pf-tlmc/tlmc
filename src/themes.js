import { createMuiTheme } from '@material-ui/core/styles'

export const lightTheme = createMuiTheme({
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

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  },
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
