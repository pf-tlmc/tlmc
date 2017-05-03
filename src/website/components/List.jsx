import path from 'path';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {File, Directory} from 'ls-serialize';
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

    for (const segment of this.props.pathSegments) {
      currDir = currDir
        && (currDir instanceof Directory)
        && currDir.get(decodeURIComponent(segment));
    }

    if (!currDir) {
      content = <h1>404</h1>;
    }

    else if (currDir instanceof File) {
      content = <FileView file={currDir}/>;
    }

    else {
      const pathBase = path.join(path.sep, ...this.props.pathSegments);
      content = (
        <ul>
          {Array.from(currDir).map(file => {
            const pathname = path.join(pathBase, encodeURIComponent(file.base));
            const icon = file instanceof Directory
              ? 'folder-o'
              : iconMap[file.ext.toLowerCase()] || 'file-o';
            const songIndex = this.props.getIndex(file);

            return (
              <li key={file.base} className={songIndex !== -1 && 'has-mp3-index'}>
                <Link to={pathname}>
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

    return (
      <div id="list" className="small-6 large-7 columns">
        {content}
      </div>
    );
  }
}

List.propTypes = {
  root: object.isRequired,
  pathSegments: arrayOf(string.isRequired).isRequired,
  getIndex: func.isRequired
};

export default List;
