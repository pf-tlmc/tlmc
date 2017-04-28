import React, {Component} from 'react';
import {instanceOf} from 'prop-types';
import {File} from 'ls-serialize/src/structures';

class ImageView extends Component {
  render() {
    return <span>Image View</span>;
  }
}

ImageView.propTypes = {
  file: instanceOf(File).isRequired
};

export default ImageView;
