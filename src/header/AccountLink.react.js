import React from 'react';
import { Link } from 'react-router';

import LoginMenu from 'cgps-commons/LoginMenu';

import config from '../app/config';

export default React.createClass({

  getInitialState() {
    return {
      isLoginMenuOpen: false,
    };
  },

  openLoginMenu(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ isLoginMenuOpen: true });
  },

  closeLoginMenu() {
    this.setState({ isLoginMenuOpen: false });
  },

  render() {
    return (
      <div>
        {
          config.user ?
            <Link
              className="cgps-avatar mdl-navigation__link"
              title="Go to my account"
              to="/"
            >
              <img src={config.user.photo} className="cgps-avatar__image" />
            </Link> :
            <a
              className="cgps-avatar mdl-navigation__link"
              title="Sign in to your account"
              onClick={(e) => this.openLoginMenu(e)}
              href="/signin"
            ><i className="material-icons">person</i></a>
        }
        <LoginMenu
          title="Sign in to your WGSA account"
          menuOpen={this.state.isLoginMenuOpen}
          closeMenu={this.closeLoginMenu}
          strategies={config.strategies || []}
        />
      </div>
    );
  },

});
