import React from 'react';
import { connect } from 'react-redux';

import { LocationListener } from '../../location';
import FilterAside from '../../filter/aside';
import FilterSection from '../../filter/section';
import DateSection from '../../filter/date-section';
import * as filter from '../../filter';


import { stateKey } from './index';
import * as actions from './actions';
import { getFilterSummary, getSearchText, getPrefilter } from './selectors';

function mapStateToProps(state) {
  return {
    active: filter.isActive(state, { stateKey }),
    searchText: getSearchText(state),
    filterSummary: getFilterSummary(state),
    prefilter: getPrefilter(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: () => dispatch(actions.clearFilter()),
    updateFilterValue: (filterKey, value) =>
      dispatch(actions.updateFilterValue({ [filterKey]: value })),
    applyFilter: () =>
      dispatch(actions.applyFilter()),
    updateFilter: (filterKey, value) =>
      dispatch(actions.updateFilter({ [filterKey]: value })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ active, searchText, filterSummary, updateFilterValue, applyFilter, updateFilter, clearFilter, prefilter }) => (
    <FilterAside
      active={active}
      clear={clearFilter}
      textValue={searchText}
      textOnChange={value => updateFilterValue('searchText', value)}
      textOnChangeEffect={applyFilter}
      prefilter={prefilter}
    >
      <FilterSection
        filterKey="organismId"
        heading="Organism"
        icon="bug_report"
        summary={filterSummary.organism}
        updateFilter={updateFilter}
      />
      <FilterSection
        className="capitalised"
        filterKey="type"
        heading="Type"
        icon="label"
        summary={filterSummary.type}
        updateFilter={updateFilter}
      />
      <DateSection summary={filterSummary.date} updateFilter={updateFilter} />
      <FilterSection
        filterKey="publicationYear"
        heading="Publication Year"
        icon="chrome_reader_mode"
        summary={filterSummary.publicationYear}
        updateFilter={updateFilter}
      />
      <LocationListener update={updateFilter} />
    </FilterAside>
  )
);
