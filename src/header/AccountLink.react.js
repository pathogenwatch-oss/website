import React from 'react';
import { connect } from 'react-redux';

import { toggleUserDrawer } from './actions';

import config from '../app/config';

const AccountLink = React.createClass({

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
        className="cgps-avatar wgsa-account-link"
        title={config.user ? 'My Account' : 'Sign In'}
        onClick={(e) => this.openLoginMenu(e)}
      >
        <img src={config.user ? config.user.photo : '/images/user.svg'} className="cgps-avatar__image" />
      </button>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () => dispatch(toggleUserDrawer(true)),
  };
}

export default connect(null, mapDispatchToProps)(AccountLink);
