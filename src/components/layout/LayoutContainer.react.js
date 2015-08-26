import React from 'react';

import { CGPS } from '../../defaults';
import Species from '../../species';

const navBarHeight = '56px';

const style = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
};

const headerStyle = {
  background: CGPS.COLOURS.PURPLE,
  maxHeight: navBarHeight,
  minHeight: navBarHeight,
};

const headerRowStyle = {
  height: navBarHeight,
};

const iconLinkStyle = {
  lineHeight: navBarHeight,
};

const iconStyle = {
  verticalAlign: 'middle',
  marginRight: '4px',
};

const LayoutContainer = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElement(React.findDOMNode(this.refs.container));
  },

  render() {
    return (
      <div ref="container" style={style} className="mdl-layout mdl-js-layout mdl-layout--fixed-header" data-mr-layout="container">
        <header style={headerStyle} className="mdl-layout__header">
          <div style={headerRowStyle} className="mdl-layout__header-row">
            <span className="mdl-layout-title">WGSA - <em>{Species.name}</em></span>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" style={iconLinkStyle} href="#">
                <i className="material-icons" style={iconStyle}>file_download</i>
                <span>Download</span>
              </a>
            </nav>
          </div>
        </header>
        {this.props.children}
      </div>
    );
  },

});

module.exports = LayoutContainer;
