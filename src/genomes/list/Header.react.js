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
        <SortBy stateKey={stateKey} update={updateFilter} sortKey="name">
          Name
        </SortBy>
      </span>
      <Sort sortKey="organismId">Organism</Sort>
      <Sort sortKey="st">ST</Sort>
      <Sort sortKey="country">Country</Sort>
      <Sort sortKey="date">Date</Sort>
      <Sort sortKey="type">Type</Sort>
    </div>
    { hasScrollbar &&
      <div style={{ overflowY: 'scroll', visibility: 'hidden' }}></div> }
  </div>
);
