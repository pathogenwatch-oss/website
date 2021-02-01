import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import NavLink from '../location';
import AccountHeader from './AccountHeader.react';
import GenomeIcon from '../components/GenomeIcon.react';
import { Icon } from '../branding';

import { getFormattedSummary } from '../summary/selectors';

import { toggleUserDrawer } from './actions';

import config from '../app/config';
import { setStoredSelection } from '../genomes/selection/utils';
const { user } = config;

const documentationURL = 'https://cgps.gitbook.io/pathogenwatch';

const UserDrawer = React.createClass({
  propTypes: {
    visible: React.PropTypes.bool,
    closeMenu: React.PropTypes.func,
  },

  componentDidMount() {
    window.addEventListener('keyup', this.handleEscKey);
  },

  componentDidUpdate(previous) {
    if (previous.location !== this.props.location && this.props.visible) {
      this.props.closeMenu();
    }
  },

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEscKey);
  },

  handleEscKey(e) {
    if (e.keyCode === 27 && this.props.visible) {
      this.props.closeMenu();
    }
  },

  handleSignOut(e) {
    e.preventDefault();
    setStoredSelection().then(() => {
      window.location.pathname = '/signout';
    });
  },

  render() {
    const { summary } = this.props;
    const {
      allCollections,
      allGenomes,
      binnedGenomes,
      userCollections,
      userGenomes,
      offlineCollections = 0,
      binnedCollections,
      numOrganisms,
    } = summary;
    return (
      <div
        className={classnames('mdl-layout__obfuscator', {
          'is-visible': this.props.visible,
        })}
        onClick={this.props.closeMenu}
        onKeyUp={this.handleEscKey}
      >
        <div
          className={classnames('mdl-layout__drawer', {
            'is-visible': this.props.visible,
          })}
          onClick={e => e.stopPropagation()}
        >
          <div className="wgsa-drawer-content">
            <span className="mdl-layout-title">
              <AccountHeader user={user} />
              <Icon />
              {config.version && (
                <a
                  href={`${documentationURL}/release-notes/#${config.version}`}
                  target="_blank"
                  rel="noopener"
                  className="wgsa-version"
                >
                  {config.version}
                </a>
              )}
            </span>
            <nav className="mdl-navigation">
              {user ? (
                <NavLink to="/account" icon="account_circle">
                  My Account
                </NavLink>
              ) : (
                <NavLink to="/sign-in" icon="verified_user">
                  Sign In
                </NavLink>
              )}
            </nav>
            <hr />
            <nav className="mdl-navigation">
              <h2 className="wgsa-navigation-header">Genomes</h2>
              <NavLink
                to="/genomes/all"
                badge={allGenomes}
                icon={<GenomeIcon />}
              >
                {user ? 'All' : 'Public'} Genomes
              </NavLink>
              {user && (
                <NavLink to="/genomes/user" badge={userGenomes} icon="person">
                  My Genomes
                </NavLink>
              )}
              {user && (
                <NavLink to="/genomes/bin" badge={binnedGenomes} icon="delete">
                  Bin
                </NavLink>
              )}
              <NavLink to="/upload" icon="cloud_upload">
                Upload
              </NavLink>
            </nav>
            <hr />
            <nav className="mdl-navigation">
              <h2 className="wgsa-navigation-header">Collections</h2>
              <NavLink
                to="/collections/all"
                badge={allCollections}
                icon="collections"
              >
                {user ? 'All' : 'Public'} Collections
              </NavLink>
              {user && (
                <NavLink
                  to="/collections/user"
                  badge={userCollections}
                  icon="person"
                >
                  My Collections
                </NavLink>
              )}
              <NavLink
                to="/offline"
                badge={offlineCollections}
                icon="signal_wifi_off"
              >
                Offline Collections
              </NavLink>
              {user && (
                <NavLink
                  to="/collections/bin"
                  badge={binnedCollections}
                  icon="delete"
                >
                  Bin
                </NavLink>
              )}
            </nav>
            <hr />
            <nav className="mdl-navigation">
              {/* <NavLink
                to="/organisms"
                icon="bug_report"
                badge={numOrganisms}
                activeOnIndexOnly
              >
                All Organisms
              </NavLink> */}
              <NavLink to={documentationURL} external icon="help">
                Documentation
              </NavLink>
              <NavLink
                to="https://gitlab.com/cgps/pathogenwatch/roadmap"
                external
                icon="feedback"
              >
                Feedback
              </NavLink>
            </nav>
            {user && (
              <nav className="mdl-navigation">
                <a
                  href="/signout"
                  className="mdl-navigation__link"
                  onClick={this.handleSignOut}
                >
                  <i className="material-icons">exit_to_app</i>
                  <span>Sign Out</span>
                </a>
              </nav>
            )}
            <footer className="wgsa-menu-footer">
              <a
                className="cgps-logo"
                target="_blank"
                rel="noopener"
                href="http://www.pathogensurveillance.net"
              >
                <img src="/images/cgps-short.svg" />
              </a>
              <a className="contact-email" href="mailto:pathogenwatch@cgps.group">
                pathogenwatch@cgps.group
              </a>
            </footer>
          </div>
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    summary: getFormattedSummary(state),
    location: state.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(toggleUserDrawer(false)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDrawer);
