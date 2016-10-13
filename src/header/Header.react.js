import './styles.css';

import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import DefaultContent from './DefaultContent.react';

import { selector as getHeader } from './index';

function mapStateToProps(state) {
  return getHeader(state);
}

export default connect(mapStateToProps)(
  ({ hasAside, content, className, location }) => (
    <header className={
      classnames(
        'mdl-layout__header mdl-layout__header--scroll wgsa-header',
        { 'wgsa-has-aside': hasAside },
        className,
      )}
    >
      <div className="mdl-layout__header-row">
        <span className="mdl-layout-title">
          <img src="/assets/img/WGSA.FINAL.svg" className="wgsa-header-logo" />
        </span>
        {content || <DefaultContent hasAside={hasAside} location={location} />}
      </div>
    </header>
  )
);
