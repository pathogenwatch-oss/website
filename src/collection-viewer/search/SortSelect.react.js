import React from 'react';
import { connect } from 'react-redux';

import { getSearchSort } from './selectors';

import { selectSort } from './actions';

import { sortKeys } from './constants';

const SortSelect = ({ active, onChange }) => (
  <aside>
    <label>
      Sort by
      <select value={active} onChange={onChange}>
        <option value={sortKeys.FREQ_DESC}>Frequency: High to Low</option>
        <option value={sortKeys.FREQ_ASC}>Frequency: Low to High</option>
        <option value={sortKeys.VALUE_DESC}>Value: High to Low</option>
        <option value={sortKeys.VALUE_ASC}>Value: Low to High</option>
      </select>
    </label>
  </aside>
);

function mapStateToProps(state) {
  return {
    active: getSearchSort(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: e => dispatch(selectSort(e.target.value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SortSelect);
