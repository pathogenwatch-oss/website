import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import MenuButton from './MenuButton.react';
import DefaultContent from './DefaultContent.react';
import { Logo } from '../branding';

import { getHeader } from './selectors';

import { isOffline } from '../offline';

const OfflineLink = () => (
  <Link
    to="/offline"
    className="wgsa-main-menu-button"
    title="View Saved Collections"
  >
    <i className="material-icons">signal_wifi_off</i>
  </Link>
);

const Header = ({
  asideEnabled, className, offline,
  children = <DefaultContent asideEnabled={asideEnabled} />,
}) => (
  <header className={
    classnames(
      'mdl-layout__header mdl-layout__header--scroll wgsa-header',
      { 'wgsa-header--inverse': offline },
      className,
    )}
  >
    <div className="mdl-layout__header-row">
      { offline ? <OfflineLink /> : <MenuButton />}
      <Link to="/" className="mdl-layout-title">
        <Logo className="wgsa-header-logo" />
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
