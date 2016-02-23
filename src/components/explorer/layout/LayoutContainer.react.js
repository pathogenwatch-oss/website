import React from 'react';
import { connect } from 'react-redux';

import DownloadsMenu from '../DownloadsMenu.react';
import Search from '../Search.react';

import { setMenuActive } from '^/actions/downloads';
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
    downloadMenuButtonClick: React.PropTypes.func,
    children: React.PropTypes.arrayOf(React.PropTypes.element),
  },

  componentDidMount() {
    componentHandler.upgradeElement(this.refs.container);
  },

  render() {
    const { handleBodyClick, downloadMenuButtonClick } = this.props;
    return (
      <div ref="container" style={style} className="mdl-layout mdl-js-layout mdl-layout--fixed-header" onClick={handleBodyClick}>
        <header style={headerStyle} className="mdl-layout__header">
          <div style={headerRowStyle} className="mdl-layout__header-row">
            <span className="mdl-layout-title">WGSA | {Species.formattedName}</span>
            <Search />
            <nav className="mdl-navigation" onClick={e => e.stopPropagation()}>
              <button className="wgsa-menu-button mdl-button" onClick={downloadMenuButtonClick}>
                <i className="wgsa-button-icon material-icons">file_download</i>
                <span>Downloads</span>
              </button>
            </nav>
          </div>
        </header>
        {this.props.children}
        <DownloadsMenu />
      </div>
    );
  },

});

function mapStateToProps({ downloads }) {
  return {
    menuOpen: downloads.menuOpen,
  };
}

function mergeProps({ menuOpen }, { dispatch }, props) {
  return {
    ...props,
    handleBodyClick: e => dispatch(clicked(e)),
    downloadMenuButtonClick: () => dispatch(setMenuActive(!menuOpen)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(LayoutContainer);
