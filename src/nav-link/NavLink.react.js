import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

function mapStateToProps({ location }) {
  return { location };
}

export default connect(mapStateToProps)(
  ({ icon, text, link }) => (
    <Link
      className="mdl-navigation__link"
      activeClassName="mdl-navigation__link--active"
      onlyActiveOnIndex
      to={link}
    >
      { icon && <i className="material-icons">{icon}</i>}
      <span>{text}</span>
    </Link>
  )
);
