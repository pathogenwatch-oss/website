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

const Filter = ({ active, searchText, filterSummary, updateFilterValue, applyFilter, updateFilter, clearFilter, prefilter }) => (
  <FilterAside
    active={active}
    clear={clearFilter}
    prefilter={prefilter}
    summary={filterSummary}
    textValue={searchText}
    textOnChange={value => updateFilterValue('searchText', value)}
    textOnChangeEffect={applyFilter}
    updateFilter={updateFilter}
  >
    <FilterSection
      filterKey="organismId"
      heading="Organism"
      icon="bug_report"
      summary={filterSummary.organism}
    />
    <FilterSection
      className="capitalised"
      filterKey="access"
      heading="Access"
      icon="person"
    />
    <DateSection summary={filterSummary.date} />
    <FilterSection
      filterKey="publicationYear"
      heading="Publication Year"
      icon="chrome_reader_mode"
    />
    <LocationListener update={updateFilter} />
  </FilterAside>
);

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
