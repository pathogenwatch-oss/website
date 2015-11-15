import React from 'react';
import { connect } from 'react-redux';

import DownloadsMenu from '../DownloadsMenu.react';
import Search from '../Search.react';

import { clicked } from '^/actions/bodyClick';

import { CGPS } from '^/defaults';
import Species from '^/species';

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

const LayoutContainer = React.createClass({

  displayName: 'LayoutContainer',

  propTypes: {
    handleBodyClick: React.PropTypes.func,
    children: React.PropTypes.arrayOf(React.PropTypes.element),
  },

  componentDidMount() {
    componentHandler.upgradeElement(this.refs.container);
  },

  render() {
    const { handleBodyClick } = this.props;
    return (
      <div ref="container" style={style} className="mdl-layout mdl-js-layout mdl-layout--fixed-header" onClick={handleBodyClick}>
        <header style={headerStyle} className="mdl-layout__header">
          <div style={headerRowStyle} className="mdl-layout__header-row">
            <span className="mdl-layout-title">WGSA | {Species.formattedName}</span>
            <Search />
            <nav className="mdl-navigation">
              <DownloadsMenu />
            </nav>
          </div>
        </header>
        {this.props.children}
      </div>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    handleBodyClick: e => dispatch(clicked(e)),
  };
}

export default connect(null, mapDispatchToProps)(LayoutContainer);
