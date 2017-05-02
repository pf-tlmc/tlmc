import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import request from 'browser-request';
import {object} from 'prop-types';
import {deserialize} from 'ls-serialize';
import csvParse from 'csv-parse/lib/sync';

import './path'; // TODO: `path.parse` mock

import Loading from './components/Loading.jsx';
import Header from './components/Header.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import List from './components/List.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';

import './main.scss';

const TLMC_URL = window.location.origin;

class App extends Component {
  constructor() {
    super();
    this.state = {
      root: {loading: true, data: null},
      cues: {loading: true, data: null}
    };
    this.makeRequest = this.makeRequest.bind(this);
  }

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest() {
    this.setState({
      root: {loading: true, data: null},
      cues: {loading: true, data: null}
    });

    request.get(`${TLMC_URL}/tlmc/ls`, (err, res, body) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }

      let root;
      try {
        root = body && deserialize(body);
      }
      catch (err) {
        console.log(err); // eslint-disable-line no-console
      }

      this.setState({root: {loading: false, data: root}});
    });

    request.get(`${TLMC_URL}/tlmc/cue`, (err, res, body) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }

      let cues;
      try {
        cues = body && csvParse(body);
      }
      catch (err) {
        console.log(err); // eslint-disable-line no-console
      }

      this.setState({cues: {loading: false, data: cues}});
    });
  }

  render() {
    let content;
    const _path = this.props.location.pathname.replace(/^\/+|\/+$/g, '').split(/\/+/);
    const [path, pathname] = _path[0]
      ? [_path, `/${_path.join('/')}`]
      : [null, ''];

    if (this.state.root.loading || this.state.cues.loading) {
      content = <Loading/>;
    }

    else if (!this.state.root.data || !this.state.cues.data) {
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
        <div className="expanded row">
          <List root={this.state.root.data} path={path} pathname={pathname}/>
          <MusicPlayer/>
        </div>
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
