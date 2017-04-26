import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import request from 'browser-request';
import {object} from 'prop-types';

import FontAwesome from 'react-fontawesome';
import List from './components/List.jsx';

import './main.scss';

const TLMC_URL = window.location.origin;

class Loading extends Component {
  render() {
    return (
      <div>
        <FontAwesome name="refresh" spin/>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      directory: null
    };
  }

  componentDidMount() {
    request.get({url: `${TLMC_URL}/tlmc/ls`, json: true}, (err, res, body) => {
      if (!body) {
        return this.setState({loading: false});
      }

      this.setState({loading: false, directory: body});
    });
  }

  render() {
    if (this.state.loading) {
      return <Loading/>;
    }
    if (!this.state.directory) {
      return <div>Error!</div>;
    }

    return <List dir={this.state.directory} pathname={this.props.location.pathname}/>;
  }
}

App.propTypes = {
  location: object
};

ReactDOM.render(
  <BrowserRouter>
    <Route path="/" component={App}/>
  </BrowserRouter>,
  document.getElementById('app')
);
