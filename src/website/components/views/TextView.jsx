import React, {Component} from 'react';
import {File} from 'ls-serialize';
import request from 'browser-request';
import {string, instanceOf} from 'prop-types';

class TextView extends Component {
  constructor() {
    super();
    this.state = {loading: true, text: null};

    this.makeRequest = this.makeRequest.bind(this);
  }

  componentDidMount() {
    this.makeRequest();
  }

  makeRequest() {
    this.setState({loading: true, text: null});
    request.get(this.props.fileURL, (err, res, body) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }

      this.setState({loading: false, text: body});
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Fetching...</span>;
    }

    if (!this.state.text) {
      return <span>An error has occured :C</span>;
    }

    return (
      <div className="text-view">
        <pre>{this.state.text}</pre>
      </div>
    );
  }
}

TextView.propTypes = {
  file: instanceOf(File).isRequired,
  fileURL: string.isRequired
};

export default TextView;
