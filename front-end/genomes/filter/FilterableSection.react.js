import React from 'react';
import { connect } from 'react-redux';

import FilterableSection from '~/filter/section/FilterableSection.react';
import Listbuster from './Listbuster.react';

import { getListFilters } from './selectors';

function mapStateToProps(state, { filterKey }) {
  const listFilters = getListFilters(state);
  return {
    listFilterActive: listFilters[filterKey] && listFilters[filterKey].length,
  };
}

const Section = props => (
  <FilterableSection
    {...props}
    headerComponent={Listbuster}
  />
);

export default connect(mapStateToProps)(Section);
