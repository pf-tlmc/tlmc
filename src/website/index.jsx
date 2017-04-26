import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import request from 'browser-request';
import {object} from 'prop-types';

import List from './components/List.jsx';

const TLMC_URL = window.location.origin;

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
    console.log(this);
    if (this.state.loading) {
      return <div>Loading...</div>;
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
