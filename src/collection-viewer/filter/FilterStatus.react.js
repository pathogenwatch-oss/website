import React from 'react';
import { connect } from 'react-redux';

import { getFilter } from '../selectors';

import { resetFilter } from './actions';

const FilterStatus = ({ active, filteredAmount, totalAmount, clear }) => (
  <span className="wgsa-filter-status">
    <span>{filteredAmount} of {totalAmount}</span>
    { active &&
      <button className="mdl-button mdl-button--icon" onClick={clear} title="Clear Filter">
        <i className="material-icons">cancel</i>
      </button> }
  </span>
);

function mapStateToProps(state) {
  const filter = getFilter(state);
  const totalAmount = filter.unfilteredIds.length;
  return {
    totalAmount,
    filteredAmount: filter.active ? filter.ids.size : totalAmount,
    active: filter.active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clear: e => {
      e.stopPropagation();
      dispatch(resetFilter());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterStatus);
