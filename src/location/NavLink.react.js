import React from 'react';
import { Link } from 'react-router/es';
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
  ({ icon, text, link, activeOnIndexOnly, activePathname }) => (
    <Link
      className={classnames(
        'mdl-navigation__link',
        { 'mdl-navigation__link--active': isActive(activePathname, link, activeOnIndexOnly) },
      )}
      to={link}
    >
      { icon && <i className="material-icons">{icon}</i>}
      <span>{text}</span>
    </Link>
  )
);
