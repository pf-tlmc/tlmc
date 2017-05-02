import React, {Component} from 'react';
import {string} from 'prop-types';

class ImageView extends Component {
  render() {
    return (
      <div className="image-view">
        <img src={this.props.fileURL}/>
      </div>
    );
  }
}

ImageView.propTypes = {
  fileURL: string.isRequired
};

export default ImageView;
