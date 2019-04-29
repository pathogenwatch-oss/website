import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { getPrefilter } from '../filter/selectors';

const mapStateToProps = (state, { view }) => {
  const base = `/genomes/${getPrefilter(state)}`;
  const path = view ? `${base}/${view}` : base;
  const { location } = state;
  return {
    link: `${path}${location.search}`,
    active: location.pathname === path,
  };
};

const ViewSwitcher = ({ active, link, title }) => (
  <Link to={link} className={classnames('wgsa-button-group__item', { active })}>
    {title}
  </Link>
);

export default connect(mapStateToProps)(ViewSwitcher);
