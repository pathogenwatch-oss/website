import React from 'react';
import { connect } from 'react-redux';

import { LocationListener } from '../../location';
import FilterAside from '../../filter/aside';
import DateRange from '../../components/date-range';
import FilterSection from '../../filter/section';
import { selectors } from '../../filter';

import { getFilterSummary, getSearchText, isFilterOpen } from './selectors';

import { stateKey } from './index';
import * as actions from './actions';

const Filter = ({ isOpen, isActive, filterSummary, textValue, updateFilter, clearFilter }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="wgsa-genome-filter">
      <FilterAside
        loading={filterSummary.loading}
        active={isActive}
        clear={clearFilter}
        textValue={textValue}
        textOnChange={e => updateFilter('searchText', e.target.value)}
      >
        <FilterSection
          filterKey="organismId"
          heading="WGSA Organisms"
          icon="bug_report"
          summary={filterSummary.wgsaOrganisms}
          updateFilter={updateFilter}
        />
        <FilterSection
          filterKey="organismId"
          heading="Other Organisms"
          icon="bug_report"
          summary={filterSummary.otherOrganisms}
          updateFilter={updateFilter}
        />
        <FilterSection
          filterKey="sequenceType"
          heading="Sequence Type"
          icon="new_releases"
          summary={filterSummary.sequenceTypes}
          updateFilter={updateFilter}
        />
        <FilterSection
          filterKey="country"
          heading="Country"
          icon="language"
          summary={filterSummary.country}
          updateFilter={updateFilter}
        />
        <FilterSection
          heading="Date"
          icon="date_range"
          expanded={filterSummary.date && filterSummary.date.active}
        >
          { filterSummary.date &&
            <DateRange
              bounds={filterSummary.date.bounds}
              values={filterSummary.date.values}
              onChangeMin={value => updateFilter('minDate', value.toISOString())}
              onChangeMax={value => updateFilter('maxDate', value.toISOString())}
            /> }
        </FilterSection>
        <FilterSection
          className="capitalised"
          filterKey="type"
          heading="Type"
          icon="label"
          summary={filterSummary.type}
          updateFilter={updateFilter}
        />
        <FilterSection
          filterKey="uploadedAt"
          heading="Uploaded At"
          icon="cloud_upload"
          summary={filterSummary.uploadedAt}
          updateFilter={updateFilter}
        />
        <LocationListener update={updateFilter} />
      </FilterAside>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isActive: selectors.isActive(state, { stateKey }),
    filterSummary: getFilterSummary(state, { stateKey }),
    textValue: getSearchText(state),
    isOpen: isFilterOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilter: () => dispatch(actions.clearFilter()),
    updateFilter: (filterKey, value) =>
      dispatch(actions.updateFilter({ [filterKey]: value })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
