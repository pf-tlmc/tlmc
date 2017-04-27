import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import request from 'browser-request';
import {object} from 'prop-types';

import Header from './components/Header.jsx';
import List from './components/List.jsx';

import './main.scss';

const TLMC_URL = window.location.origin;

class App extends Component {
  constructor() {
    super();
    this.state = {loading: true, directory: null};

    this.makeRequest = this.makeRequest.bind(this);
  }

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest() {
    this.setState({loading: true, directory: null});
    request.get({url: `${TLMC_URL}/tlmc/ls`, json: true}, (err, res, body) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }
      this.setState({loading: false, directory: body});
    });
  }

  render() {
    let content;

    if (this.state.loading) {
      content = (
        <div id="loading">
          <i className="fa fa-circle-o-notch fa-spin"/>
        </div>
      );
    }

    else if (!this.state.directory) {
      content = (
        <div id="error">
          <div>
            An error has occurred...
            <br/>
            <br/>
            <button type="button" className="button large" onClick={this.makeRequest}>
              Try again?
            </button>
          </div>
        </div>
      );
    }

    else {
      const _path = this.props.location.pathname.replace(/^\/+|\/+$/g, '').split(/\/+/);
      const [path, pathname] = _path[0]
        ? [_path, `/${_path.join('/')}`]
        : [null, ''];
      content = (
        <List dir={this.state.directory} path={path} pathname={pathname}/>
      );
    }

    return (
      <div id="app">
        <header><Header/></header>
        <main>{content}</main>
      </div>
    );
  }
}

App.propTypes = {
  location: object
};

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={App}/>
  </BrowserRouter>,
  document.getElementById('app-container')
);
