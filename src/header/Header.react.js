import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import UserDrawer from './UserDrawer.react';
import AccountLink from './AccountLink.react';
import DefaultContent from './DefaultContent.react';

import { getHeader } from './selectors';

import { isOffline } from '../offline';

const OfflineLink = () => (
  <Link
    to="/offline"
    className="cgps-avatar wgsa-account-link"
    title="Menu not available in Offline mode."
  >
    <span className="cgps-avatar__image">
      <i className="material-icons">signal_wifi_off</i>
    </span>
  </Link>
);

const OfflineContent = () => (
  <span className="wgsa-header-content">
    <span className="mdl-navigation__link">Offline Mode</span>
  </span>
);

const Header = ({
  asideEnabled, asideVisible, userDrawerVisible, className, offline,
  children = (offline ? <OfflineContent /> : <DefaultContent asideEnabled={asideEnabled} />),
}) => (
  <header className={
    classnames(
      'mdl-layout__header mdl-layout__header--scroll wgsa-header',
      { 'wgsa-has-aside': asideVisible, 'wgsa-header--inverse': offline },
      className,
    )}
  >
    <UserDrawer visible={userDrawerVisible} />
    <div className="mdl-layout__header-row">
      { offline ? <OfflineLink /> : <AccountLink />}
      <Link to="/" className="mdl-layout-title">
        <img src="/images/WGSA.FINAL.svg" className="wgsa-header-logo" />
      </Link>
      {children}
    </div>
  </header>
);

function mapStateToProps(state) {
  return {
    ...getHeader(state),
    offline: isOffline(),
  };
}

export default connect(mapStateToProps)(Header);
