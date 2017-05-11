import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classnames from 'classnames';

function isActive(activePathname, link, activeOnIndexOnly = false) {
  if (!activePathname) return false;
  if (activeOnIndexOnly) return link === activePathname;
  return activePathname.indexOf(link) === 0;
}

function mapStateToProps({ location }) {
  return {
    activePathname: location.pathname,
  };
}

export default connect(mapStateToProps)(
  ({ icon, to, activeOnIndexOnly, activePathname, external, badge, children }) => (
    external ? (
      <a href={to} className="mdl-navigation__link">
        { icon && <i className="material-icons">{icon}</i>}
        <span>{children}</span>
      </a>
    ) : (
      <Link
        className={classnames(
          'mdl-navigation__link',
          { 'mdl-navigation__link--active': isActive(activePathname, to, activeOnIndexOnly) },
        )}
        to={to}
      >
        { icon && <i className="material-icons">{icon}</i>}
        <span>{children}</span>
        { badge !== null ? <span className="wgsa-nav-badge mdl-badge" data-badge={badge}></span> : null}
      </Link>
    )
  )
);
