import { createMuiTheme } from '@material-ui/core/styles'

export const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#0f49bd'
    }
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
    },
    MuiPaper: {
      root: {
        backgroundColor: '#f3f3f3'
      }
    }
  }
})

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#0f49bd'
    },
    background: {
      default: '#000000'
    }
  },
  typography: {
    fontSize: 16,
    fontFamily: '"Open Sans", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  overrides: {
    MuiLink: {
      root: {
        color: '#87cdff'
      }
    },
    MuiBreadcrumbs: {
      li: {
        fontSize: '0.8rem'
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: '#1b1b1b'
      }
    }
  }
})
