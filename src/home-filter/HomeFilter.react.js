import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../filter-aside';
import MetadataFilter from '../metadata-filter';
import { actions, selectors, LocationFilter } from '../filter';

import { stateKey, filters } from './filter';
import { getFilterSummary } from './selectors';

const [ searchRegExp, speciesFilter ] = filters;

function mapStateToProps(state) {
  return {
    active: selectors.isActive(state, { stateKey }),
    searchText: searchRegExp.getValue(state),
    filterSummary: getFilterSummary(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: () => dispatch(actions.clearFilter(stateKey, filters)),
    updateFilter: (filter, value) =>
      dispatch(actions.updateFilter(stateKey, filter, value)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ active, searchText, filterSummary, updateFilter, clearFilter }) => (
    <FilterAside
      active={active}
      clear={clearFilter}
      textValue={searchText}
      textOnChange={e => updateFilter(
        searchRegExp,
        e.target.value ? new RegExp(e.target.value, 'i') : null
      )}
    >
      <MetadataFilter
        title="Species"
        summary={filterSummary.species}
        onClick={value => updateFilter(speciesFilter, value)}
      />
      <LocationFilter stateKey={stateKey} filters={filters} />
    </FilterAside>
  )
);
