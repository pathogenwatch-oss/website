import React from 'react';
import { connect } from 'react-redux';

import AccountImage from '../account/AccountImage.react';

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
        title={`Main Menu (${config.user ? `Signed in as ${config.user.name}` : 'Not signed in'})`}
        onClick={(e) => this.openLoginMenu(e)}
      >
        <AccountImage />
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
