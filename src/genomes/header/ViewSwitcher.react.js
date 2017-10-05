import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { getPrefilter } from '../filter/selectors';

const mapStateToProps = (state, { view }) => {
  const base = `/genomes/${getPrefilter(state)}`;
  return {
    location: state.location,
    link: view ? `${base}/${view}` : base,
  };
};

const ViewSwitcher = ({ location, title, link }) => (
  <Link
    to={link}
    className={classnames(
      'wgsa-button-group__item',
      { active: location.pathname === link }
    )}
  >
    {title}
  </Link>
);

export default connect(mapStateToProps)(ViewSwitcher);
