// import path from './path'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
// import request from 'browser-request'
// import { deserialize, File } from 'ls-serialize'
// import csvParse from 'csv-parse/lib/sync'

import './main.scss'

import TopBar from './components/TopBar.jsx'

const TLMC_URL = process.env.NODE_ENV === 'production'
  ? 'http://tlmc.pf-n.co/'
  : window.location.origin

const trimPath = /^\/+|\/+$/g
function splitPath (pathname) {
  const trimmedPath = pathname.replace(trimPath, '')
  return trimmedPath ? trimmedPath.split('/') : []
}

class App extends Component {
  render () {
    return (
      <div id='app'>
        <div id='nav-container'>
          <TopBar />
        </div>
        <div id='main-container'>
          Hello World
        </div>
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
