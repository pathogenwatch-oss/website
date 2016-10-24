import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../filter-aside';
import DateFilter from '../date-filter';
import MetadataFilter from '../metadata-filter';

import { getMetadataFilters, getSearchText } from './selectors';

import { filters as metadataFilters, actions } from './filter';

const [ searchRegExp, speciesFilter, countryFilter ] = metadataFilters;

function mapStateToProps(state) {
  return {
    filters: getMetadataFilters(state),
    textValue: getSearchText(state),
  };
}

export default connect(mapStateToProps)(
  ({ filters, filterActive, textValue, dispatch }) => (
    <FilterAside
      active={filterActive}
      clear={() => dispatch(actions.clearFilter())}
      textValue={textValue}
      textOnChange={e => dispatch(actions.updateFilter(
        searchRegExp.key,
        e.target.value ? new RegExp(e.target.value, 'i') : null
      ))}
    >
      <MetadataFilter
        title="WGSA Species"
        summary={filters.wgsaSpecies}
        onClick={value => dispatch(actions.updateFilter(speciesFilter.key, value))}
      />
      <MetadataFilter
        title="Other Species"
        summary={filters.otherSpecies}
        onClick={value => dispatch(actions.updateFilter(speciesFilter.key, value))}
      />
      <MetadataFilter
        title="Country"
        summary={filters.country}
        onClick={value => dispatch(actions.updateFilter(countryFilter.key, value))}
      />
      <DateFilter
        min={filters.date.min}
        max={filters.date.max}
        years={filters.date.years}
        onChangeMin={value => dispatch(actions.updateFilter('minDate', value))}
        onChangeMax={value => dispatch(actions.updateFilter('maxDate', value))}
      />
    </FilterAside>
  )
);
