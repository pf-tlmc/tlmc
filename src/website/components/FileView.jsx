import React, {Component} from 'react';
import {instanceOf} from 'prop-types';
import {File} from 'ls-serialize/src/structures';

import ImageView from './ImageView.jsx';
import TextView from './TextView.jsx';

const viewMap = {
  '.cue': TextView,
  '.jpg': ImageView
  // '.mp3': MP3View
};

class FileView extends Component {
  render() {
    const extension = this.props.file.name.match(/\.[^\.]+$/);
    const View = extension && viewMap[extension[0].toLowerCase()];

    if (!View) {
      return (
        <div className="file-view">
          <h4>{this.props.file.name}</h4>
          What's up
        </div>
      );
    }

    return (
      <div className="file-view">
        <h4>{this.props.file.name}</h4>
        <View {...this.props}/>
      </div>
    );
  }
}

FileView.propTypes = {
  file: instanceOf(File).isRequired
};

export default FileView;
