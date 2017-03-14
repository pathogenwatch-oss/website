import React from 'react';
import { connect } from 'react-redux';

import { getSort } from '../filter/selectors';

import { updateFilter } from '../filter/actions';

const sortOptions = {
  name: 'Name',
  country: 'Country',
  date: 'Date',
  organismId: 'Organism',
};

const SortBy = ({ sort, onChange }) => (
    <label className="wgsa-select-box">
      <span>Sort By:</span>
      &nbsp;
      <select value={sort} onChange={onChange}>
        { Object.keys(sortOptions).map(option =>
          <option key={option} value={option}>{sortOptions[option]}</option>
        )}
      </select>
    </label>
);

function mapStateToProps(state) {
  return {
    sort: getSort(state) || 'name',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: e => dispatch(updateFilter({ sort: e.target.value })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SortBy);
