import React from 'react';
import { connect } from 'react-redux';

import Search from '../Search.react';
import AboutCollection from '../../../about-collection-dropdown';

import { setMenuActive } from '^/actions/downloads';
import { listen, clicked } from '^/actions/bodyClick';

function mapStateToProps({ downloads }) {
  return {
    menuOpen: downloads.menuOpen,
  };
}

function mergeProps({ menuOpen }, { dispatch }) {
  return {
    downloadMenuButtonClick: () => dispatch(setMenuActive(!menuOpen)),
  };
}

export const HeaderContent = connect(mapStateToProps, null, mergeProps)(
  ({ downloadMenuButtonClick }) => (
    <span className="mdl-layout-spacer mdl-layout-spacer--flex">
      <Search />
      <nav className="wgsa-header-collection-options mdl-navigation" onClick={e => e.stopPropagation()}>
        <button className="wgsa-menu-button mdl-button" onClick={downloadMenuButtonClick}>
          <i className="wgsa-button-icon material-icons">file_download</i>
          <span>Downloads</span>
        </button>
        <AboutCollection />
      </nav>
    </span>
  )
);

export default connect()(React.createClass({

  displayName: 'LayoutContainer',

  propTypes: {
    downloadMenuButtonClick: React.PropTypes.func,
    children: React.PropTypes.arrayOf(React.PropTypes.element),
    dispatch: React.PropTypes.func,
  },

  componentWillMount() {
    document.title = 'WGSA | Explore Collection';

    this.props.dispatch(
      listen(() => this.props.dispatch(clicked()))
    );
  },

  componentWillUnmount() {
    this.props.dispatch(listen(null));
  },

  render() {
    return (
      <span>{this.props.children}</span>
    );
  },

}));
