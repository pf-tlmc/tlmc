import React, {Component} from 'react';
import {instanceOf} from 'prop-types';
import {File} from 'ls-serialize';

import TextView from './TextView.jsx';
import ImageView from './ImageView.jsx';

const TLMC_URL = window.location.origin;
const viewMap = {
  '.cue': TextView,
  '.jpg': ImageView,
  '.log': TextView
  // '.mp3': MP3View
};

class DefaultView extends Component {
  render() {
    return <div>TODO: There is no view for this file type yet</div>;
  }
}

class FileView extends Component {
  render() {
    const View = (viewMap[this.props.file.ext.toLowerCase()]) || DefaultView;
    let currFile = this.props.file;
    let fileURL = encodeURIComponent(currFile.base);
    while (currFile = currFile.parent) {
      fileURL = `${encodeURIComponent(currFile.base)}/` + fileURL;
    }
    fileURL = `${TLMC_URL}/${fileURL}`;

    return (
      <div className="file-view">
        <div className="file-view-title">
          <h4>{this.props.file.name}</h4>
          <a className="button" href={fileURL} download>Download File</a>
        </div>
        <View file={this.props.file} fileURL={fileURL}/>
      </div>
    );
  }
}

FileView.propTypes = {
  file: instanceOf(File).isRequired
};

export default FileView;
