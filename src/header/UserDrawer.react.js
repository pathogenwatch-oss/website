import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import NavLink from '../location';
import AccountHeader from './AccountHeader.react';
import SignInNav from './SignInNav.react';
import GenomeIcon from '../components/GenomeIcon.react';

import { getSummary } from '../summary/selectors';

import { toggleUserDrawer } from './actions';

import config from '../app/config';
const { user } = config;

const UserDrawer = React.createClass({

  propTypes: {
    visible: React.PropTypes.bool,
    closeMenu: React.PropTypes.func,
  },

  componentDidMount() {
    window.addEventListener('keyup', this.handleEscKey);
  },

  componentDidUpdate(previous) {
    if ((previous.location !== this.props.location) && this.props.visible) {
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

  render() {
    const { summary } = this.props;
    const {
      allCollections, allGenomes, binnedGenomes,
      userCollections, userGenomes, offlineCollections = 0, binnedCollections,
      numOrganisms,
    } = summary;
    return (
      <div
        className={classnames('mdl-layout__obfuscator', { 'is-visible': this.props.visible })}
        onClick={this.props.closeMenu}
        onKeyUp={this.handleEscKey}
      >
        <div
          className={classnames('mdl-layout__drawer', { 'is-visible': this.props.visible })}
          onClick={e => e.stopPropagation()}
        >
          <div className="wgsa-drawer-content">
            <span className="mdl-layout-title">
              <AccountHeader user={user} />
              <img src="/images/WGSA.Icon.FINAL.svg" />
              { config.version &&
                <small className="wgsa-version">
                  {config.version}
                </small> }
            </span>
            <SignInNav />
            { !user && <hr /> }
            <nav className="mdl-navigation">
              <h2 className="wgsa-navigation-header">Collections</h2>
              <NavLink to="/collections/all" badge={allCollections} icon="collections">
                { user ? 'All' : 'Public' } Collections
              </NavLink>
              { user && <NavLink to="/collections/user" badge={userCollections} icon="person">My Collections</NavLink> }
              <NavLink to="/offline" badge={offlineCollections} icon="signal_wifi_off">Offline Collections</NavLink>
              { user && <NavLink to="/collections/bin" badge={binnedCollections} icon="delete">Bin</NavLink> }
            </nav>
            <hr />
            <nav className="mdl-navigation">
              <h2 className="wgsa-navigation-header">Genomes</h2>
              <NavLink to="/genomes/all" badge={allGenomes} icon={<GenomeIcon />}>
                { user ? 'All' : 'Public' } Genomes
              </NavLink>
              { user && <NavLink to="/genomes/user" badge={userGenomes} icon="person">My Genomes</NavLink> }
              { user && <NavLink to="/genomes/bin" badge={binnedGenomes} icon="delete">Bin</NavLink> }
              <NavLink to="/upload" icon="cloud_upload">Upload</NavLink>
            </nav>
            <hr />
            <nav className="mdl-navigation">
              <NavLink to="/organisms" icon="bug_report" badge={numOrganisms} activeOnIndexOnly>All Organisms</NavLink>
              <NavLink to="/documentation" icon="help">Documentation</NavLink>
              <NavLink to="https://gitlab.com/cgps/wgsa.net/issues" external icon="feedback">Feedback</NavLink>
            </nav>
            { user &&
              <nav className="mdl-navigation">
                <a href="/signout" className="mdl-navigation__link">
                  <i className="material-icons">exit_to_app</i>
                  <span>Sign Out</span>
                </a>
              </nav> }
            <footer className="wgsa-menu-footer">
              <a className="cgps-logo" target="_blank" rel="noopener" href="http://www.pathogensurveillance.net">
                <img src="/images/CGPS.SHORT.FINAL.svg" />
              </a>
              <a className="contact-email" href="mailto:cgps@sanger.ac.uk">cgps@sanger.ac.uk</a>
            </footer>
          </div>
        </div>
      </div>
    );
  },

});

function mapStateToProps(state) {
  return {
    summary: getSummary(state),
    location: state.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeMenu: () => dispatch(toggleUserDrawer(false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDrawer);
