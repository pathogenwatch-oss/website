import React from 'react';
import { connect } from 'react-redux';

import { LocationListener } from '../../location';
import FilterAside from '../../filter/aside';
import AsideSection from '../../filter/section';
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
      <AsideSection
        filterKey="organismId"
        heading="Organisms"
        icon="bug_report"
        summary={filterSummary.organism}
        updateFilter={updateFilter}
      />
      <AsideSection
        className="capitalised"
        filterKey="type"
        heading="Type"
        icon="label"
        summary={filterSummary.type}
        updateFilter={updateFilter}
      />
      <LocationListener update={updateFilter} />
    </FilterAside>
  )
);
