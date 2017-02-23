import React from 'react';
import { connect } from 'react-redux';

import LocationListener from '../../location';
import FilterAside from '../../filter/aside';
import SummarySection from '../../filter/summary-section';
import * as filter from '../../filter';

import { stateKey } from './index';
import * as actions from './actions';
import { getFilterSummary, getSearchText } from './selectors';

function mapStateToProps(state) {
  return {
    active: filter.isActive(state, { stateKey }),
    searchText: getSearchText(state),
    filterSummary: getFilterSummary(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: () => dispatch(actions.clearFilter()),
    updateFilter: (filterKey, value) =>
      dispatch(actions.updateFilter({ [filterKey]: value })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ active, searchText, filterSummary, updateFilter, clearFilter }) => (
    <FilterAside
      active={active}
      clear={clearFilter}
      textValue={searchText}
      textOnChange={e => updateFilter('searchText', e.target.value)}
    >
      <SummarySection
        filterKey="speciesId"
        heading="Species"
        summary={filterSummary.species}
        updateFilter={updateFilter}
      />
      <SummarySection
        filterKey="owner"
        heading="Owner"
        summary={filterSummary.owner}
        updateFilter={updateFilter}
      />
      <LocationListener update={updateFilter} />
    </FilterAside>
  )
);
