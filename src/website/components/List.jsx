import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {object, string, arrayOf} from 'prop-types';

class List extends Component {
  render() {
    let location = this.props.dir;

    if (this.props.path) {
      for (const segment of this.props.path) {
        const decoded = decodeURIComponent(segment);
        location = location && location.files && location.files.find(file =>
          typeof file === 'object' && file.name === decoded || file === decoded
        );
      }
    }

    if (!location) {
      return <h1>404</h1>;
    }

    if (typeof location === 'object') {
      return (
        <ul>
          {location.files.map(file => {
            const fileName = typeof file === 'object' ? file.name : file;
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

    return <h1>{location}</h1>;
  }
}

List.propTypes = {
  dir: object.isRequired,
  pathname: string.isRequired,
  path: arrayOf(string)
};

export default List;
