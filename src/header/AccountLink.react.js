import React from 'react';
import { Link } from 'react-router';
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
      config.user ?
        <Link
          className="cgps-avatar"
          title="Go to my account"
          to="/"
        >
          <img src={config.user.photo} className="cgps-avatar__image" />
        </Link> :
        <a
          className="cgps-avatar"
          title="Sign in to your account"
          onClick={(e) => this.openLoginMenu(e)}
          href="/signin"
        ><i className="material-icons">person</i></a>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    openMenu: () => dispatch(toggleUserDrawer(true)),
  };
}

export default connect(null, mapDispatchToProps)(AccountLink);
