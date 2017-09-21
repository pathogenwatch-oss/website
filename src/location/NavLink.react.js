import React from 'react';
import { Link } from 'react-router-dom';
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
  ({ className, icon, to, activeOnIndexOnly, activePathname, external, badge, children }) => (
    external ? (
      <a href={to} target="_blank" rel="noopener" className={classnames('mdl-navigation__link', className)}>
        { icon && <i className="material-icons">{icon}</i>}
        <span>{children}</span>
      </a>
    ) : (
      <Link
        className={classnames(
          'mdl-navigation__link',
          className,
          { 'mdl-navigation__link--active': isActive(activePathname, to, activeOnIndexOnly) },
        )}
        to={to}
      >
        { typeof icon === 'string' ? <i className="material-icons">{icon}</i> : icon }
        <span>{children}</span>
        { badge !== null ? <span className="wgsa-nav-badge mdl-badge" data-badge={badge}></span> : null}
      </Link>
    )
  )
);
