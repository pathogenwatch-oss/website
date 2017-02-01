import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../../filter-aside';
import DateFilter from '../../date-filter';
import MetadataFilter from '../../metadata-filter';
import * as filter from '../../filter';

import { getFilterSummary, getSearchText } from './selectors';

import { stateKey, filters } from './filter';

const { LocationListener } = filter;
const [
  searchRegExp, speciesFilter, ownershipFilter, countryFilter, minDate, maxDate,
] = filters;

function mapStateToProps(state) {
  return {
    isActive: filter.isActive(state, { stateKey }),
    filterSummary: getFilterSummary(state, { stateKey }),
    textValue: getSearchText(state),
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
  ({ isActive, filterSummary, textValue, updateFilter, clearFilter }) => (
    <FilterAside
      active={isActive}
      clear={clearFilter}
      textValue={textValue}
      textOnChange={e => updateFilter(
        searchRegExp,
        e.target.value ? new RegExp(e.target.value, 'i') : null
      )}
    >
      <MetadataFilter
        title="WGSA Species"
        summary={filterSummary.wgsaSpecies}
        onClick={value => updateFilter(speciesFilter, value)}
      />
      <MetadataFilter
        title="Other Species"
        summary={filterSummary.otherSpecies}
        onClick={value => updateFilter(speciesFilter, value)}
      />
      <MetadataFilter
        title="Owner"
        summary={filterSummary.owner}
        onClick={value => updateFilter(ownershipFilter, value)}
      />
      <MetadataFilter
        title="Country"
        summary={filterSummary.country}
        onClick={value => updateFilter(countryFilter, value)}
      />
      <DateFilter
        min={filterSummary.date.min}
        max={filterSummary.date.max}
        years={filterSummary.date.years}
        onChangeMin={value => updateFilter(minDate, value)}
        onChangeMax={value => updateFilter(maxDate, value)}
      />
      <LocationListener stateKey={stateKey} filters={filters} />
    </FilterAside>
  )
);
