import React from 'react';
import { connect } from 'react-redux';

import LocationListener from '../../location';
import FilterAside from '../../filter/aside';
import DateFilter from '../../date-filter';
import SummarySection from '../../filter/summary-section';
import { selectors } from '../../filter';

import { getFilterSummary, getSearchText } from './selectors';

import { stateKey } from './index';
import * as actions from './actions';

function mapStateToProps(state) {
  return {
    isActive: selectors.isActive(state, { stateKey }),
    filterSummary: getFilterSummary(state, { stateKey }),
    textValue: getSearchText(state),
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
  ({ isActive, filterSummary, textValue, updateFilter, clearFilter }) => (
    <FilterAside
      loading={filterSummary.loading}
      active={isActive}
      clear={clearFilter}
      textValue={textValue}
      textOnChange={e => updateFilter('searchText', e.target.value)}
    >
      <SummarySection
        filterKey="speciesId"
        heading="WGSA Species"
        summary={filterSummary.wgsaSpecies}
        updateFilter={updateFilter}
      />
      <SummarySection
        filterKey="speciesId"
        heading="Other Species"
        summary={filterSummary.otherSpecies}
        updateFilter={updateFilter}
      />
      <SummarySection
        filterKey="reference"
        heading="Reference"
        summary={filterSummary.reference}
        updateFilter={updateFilter}
      />
      <SummarySection
        filterKey="owner"
        heading="Owner"
        summary={filterSummary.owner}
        updateFilter={updateFilter}
      />
      <SummarySection
        filterKey="country"
        heading="Country"
        summary={filterSummary.country}
        updateFilter={updateFilter}
      />
      {/* <DateFilter
        min={filterSummary.date.min}
        max={filterSummary.date.max}
        years={filterSummary.date.years}
        onChangeMin={value => updateFilter(minDate, value)}
        onChangeMax={value => updateFilter(maxDate, value)}
      /> */}
      <LocationListener update={updateFilter} />
    </FilterAside>
  )
);
