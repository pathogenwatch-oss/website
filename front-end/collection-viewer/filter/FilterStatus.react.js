import React from 'react';
import { connect } from 'react-redux';

import { getFilter } from './selectors';

import { clearFilters } from './actions';

const FilterStatus = ({ active, filteredAmount, totalAmount, clear, children }) => (
  <span className="wgsa-filter-status" onClick={e => e.stopPropagation()}>
    <span>{filteredAmount} of {totalAmount}</span>
    {children}
    <button
      className="mdl-button mdl-button--icon"
      onClick={clear}
      title="Clear filter"
      disabled={!active}
    >
      <i className="material-icons">backspace</i>
    </button>
  </span>
);

function mapStateToProps(state) {
  const filter = getFilter(state);
  return {
    totalAmount: filter.total,
    filteredAmount: filter.count,
    active: filter.active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clear: () => dispatch(clearFilters()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterStatus);
