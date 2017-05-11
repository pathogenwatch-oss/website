import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';

import UserDrawer from './UserDrawer.react';
import AccountLink from './AccountLink.react';
import DefaultContent from './DefaultContent.react';

import { getHeader } from './selectors';

function mapStateToProps(state) {
  return getHeader(state);
}

export default connect(mapStateToProps)(
  ({ asideVisible, userDrawerVisible, className,
    drawerLink = <AccountLink />,
    drawer = <UserDrawer visible={userDrawerVisible} />,
    children = <DefaultContent />,
  }) => (
    <header className={
      classnames(
        'mdl-layout__header mdl-layout__header--scroll wgsa-header',
        { 'wgsa-has-aside': asideVisible },
        className,
      )}
    >
      {drawer}
      <div className="mdl-layout__header-row">
        {drawerLink}
        <Link to="/" className="mdl-layout-title">
          <img src="/images/WGSA.FINAL.svg" className="wgsa-header-logo" />
        </Link>
        {children}
      </div>
    </header>
  )
);
