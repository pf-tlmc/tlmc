import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {string, arrayOf} from 'prop-types';

class Header extends Component {
  render() {
    const crumbs = [{displayName: 'TLMC', pathname: '/'}];
    let currPath = '';
    for (const segment of (this.props.path || [])) {
      currPath += `/${segment}`;
      crumbs.push({
        displayName: decodeURIComponent(segment),
        pathname: currPath
      });
    }
    const currCrumb = crumbs.pop();

    return (
      <div id="breadcrumbs">
        <ul className="breadcrumbs">
          {crumbs.map(crumb =>
            <li key={crumb.displayName}>
              <Link to={crumb.pathname}>{crumb.displayName}</Link>
            </li>
          )}
          <li>{currCrumb.displayName}</li>
        </ul>
      </div>
    );
  }
}

Header.propTypes = {
  path: arrayOf(string.isRequired)
};

export default Header;
