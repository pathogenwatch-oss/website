import '../css/dropdown-menu.css';

import React from 'react';

export default React.createClass({

  propTypes: {
    active: true,
  },

  render() {
    return (
      <ul className={`wgsa-menu mdl-shadow--2dp ${this.props.active ? 'wgsa-menu--is-open' : ''}`}>
        <li>
          <span className="wgsa-menu-heading">Species Downloads</span>
          <ul className="wgsa-submenu">
            <li className="wgsa-menu__item">
              <button className="mdl-button mdl-button--icon">
                <i className="wgsa-button-icon material-icons">file_download</i>
              </button>
              Population Tree (.nwk)
            </li>
          </ul>
        </li>
        <li>
          <span className="wgsa-menu-heading">Collection Downloads</span>
          <ul className="wgsa-submenu">
            <li className="wgsa-menu__item">
              <button className="mdl-button mdl-button--icon">
                <i className="wgsa-button-icon material-icons">file_download</i>
              </button>
              Kernal Checksum Distribution
            </li>
            <li className="wgsa-menu__item">
              <button className="mdl-button mdl-button--icon">
                <i className="wgsa-button-icon material-icons">file_download</i>
              </button>
              Concatenated Gene Family Alignments
            </li>
            <li className="wgsa-menu__item">
              <button className="mdl-button mdl-button--icon">
                <i className="wgsa-button-icon material-icons">file_download</i>
              </button>
              Collection Tree (.nwk)
            </li>
          </ul>
        </li>
      </ul>
    );
  },

});
