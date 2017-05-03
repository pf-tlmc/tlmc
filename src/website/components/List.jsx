import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Directory} from 'ls-serialize';
import {object, string, func, arrayOf} from 'prop-types';

import FileView from './views/FileView.jsx';

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
            const songIndex = this.props.getIndex(file);

            return (
              <li key={file.base} className={songIndex !== -1 && 'has-mp3-index'}>
                <Link to={path}>
                  <i className={`fa fa-${icon} fa-lg fa-fw`}/>&nbsp;
                  {file.base}
                </Link>
                {songIndex !== -1 &&
                  <a className="mp3-index">
                    <i className="fa fa-play"/>&nbsp;&nbsp;{songIndex + 1}
                  </a>}
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
      <div id="list" className="small-6 large-7 columns">
        {content}
      </div>
    );
  }
}

List.propTypes = {
  root: object.isRequired,
  pathname: string.isRequired,
  path: arrayOf(string.isRequired),
  getIndex: func.isRequired
};

export default List;
