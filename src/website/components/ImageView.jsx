import React, {Component} from 'react';
import {instanceOf} from 'prop-types';
import {File} from 'ls-serialize';

const TLMC_URL = window.location.origin;

class TextView extends Component {
  render() {
    return (
      <div className="image-view">
        <img src={`${TLMC_URL}/${this.props.file.pathURIEncoded}`}/>
      </div>
    );
  }
}

TextView.propTypes = {
  file: instanceOf(File).isRequired
};

export default TextView;
