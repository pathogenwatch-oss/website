import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import LoginLink from '../cgps-commons/LoginLink.react';
import NavLink from '../location';
import AccountHeader from 'cgps-commons/Avatar/Link.react';

import { getSummary } from '../summary/selectors';

import { toggleUserDrawer } from './actions';

import config from '../app/config';
const { user } = config;

const defaultUser = {
  photo: '/images/user.svg',
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
    const { allCollections, allGenomes, userCollections, userGenomes } = this.props;
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
              user={user || defaultUser}
              linkTo={user ? '/account' : null}
              image="top"
              className="wgsa-account-header"
            />
            <img src="/images/WGSA.Icon.FINAL.svg" />
            { config.version &&
              <small className="wgsa-version">
                v{config.version}
              </small>
            }
          </span>
          { !user &&
            <nav className="mdl-navigation">
              { strategies.map(provider => <LoginLink key={provider} provider={provider} />) }
            </nav>
          }
          { !user && <hr /> }
          <nav className="mdl-navigation">
            <h2 className="wgsa-navigation-header">Collections</h2>
            <NavLink to="/collections/all" badge={allCollections} icon="collections">All Collections</NavLink>
            { user && <NavLink to="/collections/user" badge={userCollections} icon="person">My Collections</NavLink> }
            <NavLink to="/collections/bin" icon="delete">Bin</NavLink>
          </nav>
          <hr />
          <nav className="mdl-navigation">
            <h2 className="wgsa-navigation-header">Genomes</h2>
            <NavLink to="/genomes/all" badge={allGenomes} icon="bug_report">All Genomes</NavLink>
            { user && <NavLink to="/genomes/user" badge={userGenomes} icon="person">My Genomes</NavLink> }
            <NavLink to="/genomes/bin" icon="delete">Bin</NavLink>
            <NavLink to="/genomes/upload" icon="cloud_upload">Upload</NavLink>
          </nav>
          <hr />
          <nav className="mdl-navigation">
            <NavLink to="/documentation" icon="help">Documentation</NavLink>
            <NavLink to="https://gitlab.com/cgps/wgsa.net/issues" external icon="feedback">Feedback</NavLink>
          </nav>
          { user &&
            <nav className="mdl-navigation">
              <NavLink to="/signout" external icon="exit_to_app">Sign Out</NavLink>
            </nav>
          }
          <footer className="wgsa-menu-footer">
            <a className="cgps-logo" target="_blank" rel="noopener" href="http://www.pathogensurveillance.net">
              <img src="/images/CGPS.SHORT.FINAL.svg" />
            </a>
            <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
          </footer>
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return getSummary(state);
}

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(toggleUserDrawer(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDrawer);
