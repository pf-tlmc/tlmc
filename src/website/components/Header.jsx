import React, {Component} from 'react';

class Header extends Component {
  render() {
    return (
      <nav id="nav" className="top-bar">
        <div className="top-bar-left">
          <ul className="menu" data-dropdown-menu>
            <li className="menu-text">
              TLMC | Pillowfication
            </li>
          </ul>
        </div>
        <div className="top-bar-right">
          <ul className="menu">
            <li>
              <a href="http://www.tlmc.eu/">
                <i className="fa fa-cloud-download fa-lg"/> tlmc.eu
              </a>
            </li>
            <li>
              <a href="https://github.com/pillowfication/tlmc">
                <i className="fa fa-github fa-lg"/> GitHub
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
