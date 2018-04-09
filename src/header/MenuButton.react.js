import React from 'react';
import { connect } from 'react-redux';

import { toggleUserDrawer } from './actions';

const MenuButton = React.createClass({

  propTypes: {
    openMenu: React.PropTypes.func,
  },

  openLoginMenu(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.openMenu();
  },

  render() {
    return (
      <button
        className="wgsa-account-link"
        title="Main Menu"
        onClick={(e) => this.openLoginMenu(e)}
      >
        <i className="material-icons">menu</i>
      </button>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () => dispatch(toggleUserDrawer(true)),
  };
}

export default connect(null, mapDispatchToProps)(MenuButton);
