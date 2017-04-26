import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {object, string} from 'prop-types';

class List extends Component {
  render() {
    const path = this.props.pathname.replace(/^\/+|\/+$/g, '').split(/\/+/);
    let location = this.props.dir;

    if (path[0] !== '') {
      for (const segment of path) {
        location = location && location.files && location.files.find(file =>
          typeof file === 'object' && file.name === segment || file === segment
        );
      }
    }

    if (!location) {
      return <h1>404</h1>;
    }

    if (typeof location === 'object') {
      const basePath = path[0] === '' ? '' : `/${path.join('/')}`;
      return (
        <ul>
          {location.files.map(file => {
            const fileName = typeof file === 'object' ? file.name : file;
            return (
              <li key={fileName}>
                <Link to={`${basePath}/${fileName}`}>{fileName}</Link>
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
  pathname: string.isRequired
};

export default List;
