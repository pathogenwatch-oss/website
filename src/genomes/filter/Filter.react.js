import React from 'react';
import { connect } from 'react-redux';

import LocationListener from '../../location';
import FilterAside from '../../filter/aside';
import DateFilter from '../../date-filter';
import AsideSection from '../../filter/aside-section';
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
      <AsideSection
        filterKey="organismId"
        heading="WGSA Organisms"
        summary={filterSummary.wgsaOrganisms}
        updateFilter={updateFilter}
      />
      <AsideSection
        filterKey="organismId"
        heading="Other Organisms"
        summary={filterSummary.otherOrganisms}
        updateFilter={updateFilter}
      />
      <AsideSection
        filterKey="reference"
        heading="Reference"
        summary={filterSummary.reference}
        updateFilter={updateFilter}
      />
      <AsideSection
        filterKey="owner"
        heading="Owner"
        summary={filterSummary.owner}
        updateFilter={updateFilter}
      />
      <AsideSection
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
