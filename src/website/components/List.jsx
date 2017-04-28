import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Directory} from 'ls-serialize';
import {object, string, arrayOf} from 'prop-types';

import FileView from './FileView.jsx';

const iconMap = {
  '.cue': 'file-text-o',
  '.jpg': 'file-image-o',
  '.log': 'file-text-o',
  '.mp3': 'file-audio-o',
  '.tta': 'file-audio-o'
};

class List extends Component {
  render() {
    let currDir = this.props.root;

    if (this.props.path) {
      for (const segment of this.props.path) {
        const decoded = decodeURIComponent(segment);
        currDir = currDir && currDir.get(decoded);
      }
    }

    if (!currDir) {
      return <h1>404</h1>;
    }

    if (currDir instanceof Directory) {
      return (
        <ul id="list">
          {Array.from(currDir).map(([fileName, file]) => {
            const path = `${this.props.pathname}/${encodeURIComponent(fileName)}`;
            const extension = fileName.match(/\.[^\.]+$/);
            const icon = file instanceof Directory
              ? 'folder-o'
              : (extension && iconMap[extension[0].toLowerCase()]) || 'file-o';

            return (
              <li key={fileName}>
                <Link to={path}>
                  <i className={`fa fa-${icon} fa-lg fa-fw`}/>&nbsp;
                  {fileName}
                </Link>
              </li>
            );
          })}
        </ul>
      );
    }

    return <FileView file={currDir}/>;
  }
}

List.propTypes = {
  root: object.isRequired,
  pathname: string.isRequired,
  path: arrayOf(string.isRequired)
};

export default List;
