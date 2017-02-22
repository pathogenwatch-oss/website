import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../../filter-aside';
import SummarySection from '../../filter/summary-section';
import * as filter from '../../filter';

import { stateKey, filters } from './filter';
import { getFilterSummary, getSearchText } from './selectors';

const { LocationListener } = filter;
const [ searchRegExp, speciesFilter, ownershipFilter ] = filters;

function mapStateToProps(state) {
  return {
    active: filter.isActive(state, { stateKey }),
    searchText: getSearchText(state),
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
      <SummarySection
        title="Species"
        summary={filterSummary.species}
        onClick={value => updateFilter(speciesFilter, value)}
      />
      <SummarySection
        title="Owner"
        summary={filterSummary.owner}
        onClick={value => updateFilter(ownershipFilter, value)}
      />
      <LocationListener stateKey={stateKey} filters={filters} />
    </FilterAside>
  )
);
