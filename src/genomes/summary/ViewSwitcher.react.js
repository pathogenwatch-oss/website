import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getPrefilter } from '../selectors';

const mapStateToProps = state => ({
  location: state.location,
  base: getPrefilter(state).uploaded ? '/upload' : '/genomes',
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
