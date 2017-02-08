import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import LoginLink from '../cgps-commons/LoginLink.react';
import NavLink from '../location';
import AccountHeader from 'cgps-commons/Avatar/Link.react';

import { toggleUserDrawer } from './actions';

import config from '../app/config';

const navLinks = [
  { icon: 'collections', text: 'Collections', link: '/collections' },
  { icon: 'bug_report', text: 'Genomes', link: '/genomes' },
  { icon: 'file_upload', text: 'Upload', link: '/upload' },
  { icon: 'help', text: 'Documentation', link: '/documentation' },
];

const userLinks = [
  { icon: 'person', text: 'Profile', link: '/account' },
  { icon: 'subdirectory_arrow_right', text: 'My Collections', link: '/collections?owner=me' },
  { icon: 'subdirectory_arrow_right', text: 'My Genomes', link: '/genomes?owner=me' },
  { icon: 'exit_to_app', text: 'Sign Out', link: '/signout', external: true },
];

const user = {
  photo: '/assets/img/user.png',
  name: 'WGSA',
  email: 'Sign in to your account',
};

const UserDrawer = React.createClass({

  propTypes: {
    visible: React.PropTypes.bool,
    closeMenu: React.PropTypes.func,
  },

  componentDidMount() {
    window.addEventListener('keyup', this.handleEscKey);
  },

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEscKey);
  },

  handleEscKey(e) {
    if (e.keyCode === 27 && this.props.visible) {
      this.props.closeMenu();
    }
  },

  render() {
    const { strategies = [] } = config;
    return (
      <div
        className={classnames('mdl-layout__obfuscator', { 'is-visible': this.props.visible })}
        onClick={this.props.closeMenu}
        onKeyUp={this.handleEscKey}
      >
        <div className={classnames('mdl-layout__drawer', { 'is-visible': this.props.visible })}>
          <span className="mdl-layout-title">
            <AccountHeader
              user={config.user || user}
              linkTo={config.user ? '/account' : null}
              image="top"
              className="wgsa-account-header"
            />
            <img src="/assets/img/WGSA.Icon.FINAL.svg" />
            { config.wgsaVersion &&
              <small className="wgsa-version">
                v{config.wgsaVersion}
              </small>
            }
          </span>
          <nav className="mdl-navigation">
            {config.user && <h2 className="wgsa-navigation-header">My Account</h2>}
            {config.user ?
              userLinks.map(props => <NavLink key={props.link} {...props} />) :
              strategies.map(provider => <LoginLink key={provider} provider={provider} />)}
          </nav>
          <hr />
          <nav className="mdl-navigation">
            {navLinks.map(props => <NavLink key={props.link} {...props} />)}
          </nav>
          <footer className="wgsa-menu-footer">
            <a className="cgps-logo" target="_blank" rel="noopener" href="http://www.pathogensurveillance.net">
              <img src="/assets/img/CGPS.SHORT.FINAL.svg" />
            </a>
            <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
          </footer>
        </div>
      </div>
    );
  },

});

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(toggleUserDrawer(false)),
  };
}

export default connect(null, mapDispatchToProps)(UserDrawer);
