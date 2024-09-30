import React from 'react';

import SelectAll from '../selection/SelectAll.react';

import { SortBy } from '../../filter';

import { updateFilter } from '../filter/actions';
import { stateKey } from '../filter';

const Sort = props =>
  <SortBy className="wgsa-genome-list-cell" stateKey={stateKey} update={updateFilter} {...props} />;

export default ({ hasScrollbar = true }) => (
  <div className="wgsa-list-header-container">
    <div className="wgsa-genome-list-item wgsa-genome-list-header">
      <span className="wgsa-genome-list-cell" >
        <SelectAll />
        <SortBy className="wgsa-genome-list-cell" stateKey={stateKey} update={updateFilter} sortKey="name">
          Name
        </SortBy>
      </span>
      <div className="wgsa-genome-list-cell">Organism</div>
      <div className="wgsa-genome-list-cell">Type</div>
      <div className="wgsa-genome-list-cell">Typing Schema</div>
      <div className="wgsa-genome-list-cell">Country</div>
      <Sort sortKey="date">Date</Sort>
      <div className="wgsa-genome-list-cell">Access</div>
    </div>
    { hasScrollbar &&
      <div style={{ overflowY: 'scroll', visibility: 'hidden', height: 0 }} /> }
  </div>
);
