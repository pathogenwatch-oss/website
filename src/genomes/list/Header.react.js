import React from 'react';

import { SortBy } from '../../filter';

import { updateFilter } from '../filter/actions';
import { stateKey } from '../filter';

const Sort = props =>
  <SortBy stateKey={stateKey} update={updateFilter} {...props} />;

export default () => (
  <div className="wgsa-list-wrapper">
    <div className="wgsa-genome-list-item wgsa-genome-list-header wgsa-content-margin-right">
      <Sort sortKey="name">Name</Sort>
      <Sort sortKey="organismId">Organism</Sort>
      <div className="wgsa-card-content">
        <Sort sortKey="country">Country</Sort>
        <Sort sortKey="date">Date</Sort>
        <Sort sortKey="access">Access</Sort>
      </div>
      <span className="wgsa-card-metadata" style={{ width: 32 }} />
    </div>
    <div style={{ overflowY: 'scroll', visibility: 'hidden' }}></div>
  </div>
);
