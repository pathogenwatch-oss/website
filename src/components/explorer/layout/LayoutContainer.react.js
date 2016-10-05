import React from 'react';
import { connect } from 'react-redux';

import Search from '../Search.react';

import { setMenuActive } from '^/actions/downloads';
import { listen, clicked } from '^/actions/bodyClick';
import { updateHeader } from '^/actions/header';

import Species from '^/species';

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

const HeaderContent = connect(mapStateToProps, null, mergeProps)(
  ({ downloadMenuButtonClick }) => (
    <span className="mdl-layout-spacer mdl-layout-spacer--flex">
      <Search />
      <nav className="mdl-navigation" onClick={e => e.stopPropagation()}>
        <button className="wgsa-menu-button mdl-button" onClick={downloadMenuButtonClick}>
          <i className="wgsa-button-icon material-icons">file_download</i>
          <span>Downloads</span>
        </button>
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
    this.props.dispatch(updateHeader({
      speciesName: Species.formattedName,
      classNames: 'mdl-layout__header--primary mdl-shadow--3dp',
      content: (<HeaderContent />),
      hasAside: false,
    }));

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
