import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import request from 'browser-request';
import {object} from 'prop-types';
import {deserialize, File} from 'ls-serialize';
import csvParse from 'csv-parse/lib/sync';

import path from 'path';
import './path'; // TODO: `path.parse` mock

import Loading from './components/Loading.jsx';
import Header from './components/Header.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import List from './components/List.jsx';
import MusicPlayer from './components/musicPlayer/MusicPlayer.jsx';

import './main.scss';

const TLMC_URL = window.location.origin;

const pathSepEscaped = path.sep.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const trimPath = new RegExp(`^${pathSepEscaped}+|${pathSepEscaped}+$`, 'g');
function splitPath(pathname) {
  const trimmedPath = pathname.replace(trimPath, '');
  return trimmedPath ? trimmedPath.split(path.sep) : [];
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      root: {loading: true, data: null},
      songs: {loading: true, data: null}
    };
    this.makeRequest = this.makeRequest.bind(this);
    this.getIndex = this.getIndex.bind(this);
  }

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest() {
    this.setState({
      root: {loading: true, data: null},
      songs: {loading: true, data: null, dataByPath: null}
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
      /* TODO */ window._tlmcRoot = root;
    });

    request.get(`${TLMC_URL}/tlmc/cue`, (err, res, body) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }

      let songs, songsByPath;
      try {
        songs = body && csvParse(body, {columns: true});
        songsByPath = {};
        for (let index = 0; index < songs.length; ++index) {
          const song = songs[index];
          song._index = index;
          songsByPath[song.path] = song;
        }
      }
      catch (err) {
        console.log(err); // eslint-disable-line no-console
      }

      this.setState({songs: {loading: false, data: songs, dataByPath: songsByPath}});
      /* TODO */ window._tlmcSongs = songs;
      /* TODO */ window._tlmcSongsByPath = songsByPath;
    });
  }

  getIndex(file) {
    if (!(file instanceof File) || file.ext.toLowerCase() !== '.mp3') {
      return -1;
    }

    const parts = file.path.split(path.sep);
    for (let index = 1, currDir = this.state.root.data; index < parts.length - 1; ++index) {
      const segment = parts[index];
      const nextDir = currDir.get(segment);
      if (!nextDir) {
        return -1;
      }
      parts[index] = `${Array.from(currDir.fileNames).indexOf(segment)}`;
      currDir = nextDir;
    }

    let song = this.state.songs.dataByPath[path.join(...parts)];
    return song ? song._index : -1;
  }

  render() {
    const pathSegments = splitPath(this.props.location.pathname);
    let content;

    if (this.state.root.loading || this.state.songs.loading) {
      content = <Loading/>;
    }

    else if (!this.state.root.data || !this.state.songs.data) {
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
          <List
            root={this.state.root.data}
            pathSegments={pathSegments}
            getIndex={this.getIndex}
          />
          <MusicPlayer/>
        </div>
      );
    }

    return (
      <div id="app">
        <header>
          <Header/>
          <Breadcrumbs pathSegments={pathSegments}/>
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
