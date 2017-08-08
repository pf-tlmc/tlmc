// import path from './path'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
// import request from 'browser-request'
// import { deserialize, File } from 'ls-serialize'
// import csvParse from 'csv-parse/lib/sync'

import './main.scss'

// const TLMC_URL = process.env.NODE_ENV === 'production'
//   ? 'http://tlmc.pf-n.co/'
//   : window.location.origin
//
// const pathSepEscaped = path.sep.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
// const trimPath = new RegExp(`^${pathSepEscaped}+|${pathSepEscaped}+$`, 'g')
// function splitPath (pathname) {
//   const trimmedPath = pathname.replace(trimPath, '')
//   return trimmedPath ? trimmedPath.split(path.sep) : []
// }

class App extends Component {
  render () {
    return (
      <div id='app'>
        <main>Hello, World!</main>
      </div>
    )
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Route path='/' component={App} />
  </BrowserRouter>,
  document.getElementById('app-container')
)
