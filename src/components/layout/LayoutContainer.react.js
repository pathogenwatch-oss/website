import React from 'react';

import DEFAULT from '../../defaults';

const LayoutContainer = React.createClass({
  render: function () {
    const style = {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    };

    const headerStyle = {
      background: DEFAULT.CGPS.COLOURS.PURPLE,
      maxHeight: '56px',
    };

    return (
      <div style={style} className="mdl-layout mdl-js-layout mdl-layout--fixed-header" data-mr-layout="container">
        <header style={headerStyle} className="mdl-layout__header">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">WGSA - <em>S. aureus</em></span>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation">
              <a className="mdl-navigation__link" href="">Download</a>
            </nav>
          </div>
        </header>
        {this.props.children}
      </div>
    );
  },

});

module.exports = LayoutContainer;
