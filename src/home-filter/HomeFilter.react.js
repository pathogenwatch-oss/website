import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../filter-aside';
import MetadataFilter from '../metadata-filter';
import { LocationListener } from '../location';
import * as filter from '../filter';

import { stateKey, filters } from './filter';
import { getFilterSummary } from './selectors';
import { onQueryChange } from './thunks';

const [ searchRegExp, speciesFilter ] = filters;

function mapStateToProps(state) {
  return {
    active: filter.isActive(state, { stateKey }),
    searchText: searchRegExp.getValue(state),
    filterSummary: getFilterSummary(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: () => dispatch(filter.clear(stateKey, filters)),
    updateFilter: (filterDef, value) =>
      dispatch(filter.update(stateKey, filterDef, value)),
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
      <LocationListener update={onQueryChange} />
    </FilterAside>
  )
);
