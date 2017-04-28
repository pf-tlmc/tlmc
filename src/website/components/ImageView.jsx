import React, {Component} from 'react';
import {string} from 'prop-types';

class TextView extends Component {
  render() {
    return (
      <div className="image-view">
        <img src={this.props.fileURL}/>
      </div>
    );
  }
}

TextView.propTypes = {
  fileURL: string.isRequired
};

export default TextView;
