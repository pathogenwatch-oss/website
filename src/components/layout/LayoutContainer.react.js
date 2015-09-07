import '../../css/dropdown-menu.css';

import React from 'react';

import DownloadsMenu from '../DownloadsMenu.react';

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

const LayoutContainer = React.createClass({

  componentDidMount() {
    componentHandler.upgradeElement(React.findDOMNode(this.refs.container));
  },

  getInitialState() {
    return {
      downloadsOpen: false,
    };
  },

  render() {
    return (
      <div ref="container" style={style} className="mdl-layout mdl-js-layout mdl-layout--fixed-header" data-mr-layout="container">
        <header style={headerStyle} className="mdl-layout__header">
          <div style={headerRowStyle} className="mdl-layout__header-row">
            <span className="mdl-layout-title">WGSA - {Species.formattedName}</span>
            <div className="mdl-layout-spacer"></div>
            <nav className="mdl-navigation">
              <button className={`wgsa-menu-button mdl-button ${this.state.downloadsOpen ? 'active' : ''}`} onClick={this.handleDownloadsButtonClick}>
                <i className="wgsa-button-icon material-icons">file_download</i>
                <span>Downloads</span>
              </button>
            </nav>
          </div>
        </header>
        <DownloadsMenu active={this.state.downloadsOpen} />
        {this.props.children}
      </div>
    );
  },

  handleDownloadsButtonClick() {
    this.setState({
      downloadsOpen: !this.state.downloadsOpen,
    });
  },

});

module.exports = LayoutContainer;
