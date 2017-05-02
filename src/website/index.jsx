import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import request from 'browser-request';
import {object} from 'prop-types';
import {deserialize} from 'ls-serialize';

import 'path';
import './path'; // TODO: `path.parse` mock

import Loading from './components/Loading.jsx';
import Header from './components/Header.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import List from './components/List.jsx';

import './main.scss';

const TLMC_URL = window.location.origin;

class App extends Component {
  constructor() {
    super();
    this.state = {loading: true, root: null};

    this.makeRequest = this.makeRequest.bind(this);
  }

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest() {
    this.setState({loading: true, directory: null});
    request.get(`${TLMC_URL}/tlmc/ls`, (err, res, body) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }

      let root;
      try {
        root = deserialize(body);
      }
      catch (err) {
        console.log(err); // eslint-disable-line no-console
      }

      this.setState({loading: false, root});
    });
  }

  render() {
    let content;
    const _path = this.props.location.pathname.replace(/^\/+|\/+$/g, '').split(/\/+/);
    const [path, pathname] = _path[0]
      ? [_path, `/${_path.join('/')}`]
      : [null, ''];

    if (this.state.loading) {
      content = <Loading/>;
    }

    else if (!this.state.root) {
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
      content = (
        <List root={this.state.root} path={path} pathname={pathname}/>
      );
    }

    return (
      <div id="app">
        <header>
          <Header/>
          <Breadcrumbs path={path}/>
        </header>
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
