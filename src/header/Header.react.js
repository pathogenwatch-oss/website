import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router';

import UserDrawer from './UserDrawer.react';
import AccountLink from './AccountLink.react';
import DefaultContent from './DefaultContent.react';

import { selector as getHeader } from './index';

function mapStateToProps(state) {
  return getHeader(state);
}

export default connect(mapStateToProps)(
  ({ hasAside, userDrawerOpen, content, className }) => (
    <header className={
      classnames(
        'mdl-layout__header mdl-layout__header--scroll wgsa-header',
        { 'wgsa-has-aside': hasAside },
        className,
      )}
    >
      <UserDrawer visible={userDrawerOpen} />
      <div className="mdl-layout__header-row">
        <AccountLink />
        <Link to="/" className="mdl-layout-title">
          <img src="/images/WGSA.FINAL.svg" className="wgsa-header-logo" />
        </Link>
        {content || <DefaultContent hasAside={hasAside} />}
      </div>
    </header>
  )
);
