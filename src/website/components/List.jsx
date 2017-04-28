import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Directory} from 'ls-serialize/src/structures';
import {object, string, arrayOf} from 'prop-types';

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
          {Array.from(currDir).map(([fileName]) => {
            const path = `${this.props.pathname}/${encodeURIComponent(fileName)}`;
            return (
              <li key={fileName}>
                <Link to={path}>{fileName}</Link>
              </li>
            );
          })}
        </ul>
      );
    }

    return <h1>{currDir.name}</h1>;
  }
}

List.propTypes = {
  root: object.isRequired,
  pathname: string.isRequired,
  path: arrayOf(string.isRequired)
};

export default List;
