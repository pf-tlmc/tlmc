import path from 'path';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {string, arrayOf} from 'prop-types';

class Breadcrumbs extends Component {
  render() {
    const crumbs = [{displayName: 'TLMC', pathname: path.sep}];
    let currPath = path.sep;
    for (const segment of this.props.pathSegments) {
      currPath = path.join(currPath, segment);
      crumbs.push({
        displayName: decodeURIComponent(segment),
        pathname: currPath
      });
    }
    const currCrumb = crumbs.pop();

    return (
      <div id="breadcrumbs">
        <ul className="breadcrumbs">
          {crumbs.map((crumb, index) =>
            <li key={index}>
              <Link to={crumb.pathname}>{crumb.displayName}</Link>
            </li>
          )}
          <li>{currCrumb.displayName}</li>
        </ul>
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  pathSegments: arrayOf(string.isRequired).isRequired
};

export default Breadcrumbs;
