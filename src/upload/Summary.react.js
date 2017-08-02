import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { Summary as FilterSummary } from '../filter/summary';

export default ({ previous }) => (
  <FilterSummary className="wgsa-upload-summary">
    <Link className={classnames('mdl-button', { 'mdl-button--primary': !previous })} to="/upload">New Session</Link>
    <Link className={classnames('mdl-button', { 'mdl-button--primary': previous })} to="/upload/previous">Previous Sessions</Link>
  </FilterSummary>
);
