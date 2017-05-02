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
    let content;

    if (this.props.path) {
      for (const segment of this.props.path) {
        const decoded = decodeURIComponent(segment);
        currDir = currDir && currDir.get(decoded);
      }
    }

    if (!currDir) {
      content = <h1>404</h1>;
    }

    else if (currDir instanceof Directory) {
      content = (
        <ul>
          {Array.from(currDir).map(file => {
            const path = `${this.props.pathname}/${encodeURIComponent(file.base)}`;
            const icon = file instanceof Directory
              ? 'folder-o'
              : iconMap[file.ext.toLowerCase()] || 'file-o';

            return (
              <li key={file.base}>
                <Link to={path}>
                  <i className={`fa fa-${icon} fa-lg fa-fw`}/>&nbsp;
                  {file.base}
                </Link>
              </li>
            );
          })}
        </ul>
      );
    }

    else {
      content = <FileView file={currDir}/>;
    }

    return (
      <div id="list" className="medium-6 large-8 columns">
        {content}
      </div>
    );
  }
}

List.propTypes = {
  root: object.isRequired,
  pathname: string.isRequired,
  path: arrayOf(string.isRequired)
};

export default List;
