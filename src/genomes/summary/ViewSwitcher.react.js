import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getPrefilter } from '../filter/selectors';

const mapStateToProps = state => ({
  location: state.location,
  base: `/genomes/${getPrefilter(state)}`,
});

const ViewSwitcher = ({ title, base, view = '' }) => (
  <Link
    to={view ? `${base}/${view}` : base}
    className="wgsa-button-group__item"
    activeClassName="active"
    onlyActiveOnIndex
  >
    {title}
  </Link>
);

export default connect(mapStateToProps)(ViewSwitcher);
