import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../../filter-aside';
import DateFilter from '../../date-filter';
import MetadataFilter from '../../metadata-filter';

import { getFilter, getMetadataFilters } from '../selectors';

import actions from '../actions';

import { metadataFilters } from '../utils/filter';

const [ speciesFilter, countryFilter ] = metadataFilters;

function mapStateToProps(state) {
  return {
    filters: getMetadataFilters(state),
    textValue: getFilter(state).searchText,
  };
}

export default connect(mapStateToProps)(
  ({ filters, filterActive, textValue, dispatch }) => (
    <FilterAside
      active={filterActive}
      clear={() => dispatch(actions.clearFilter())}
      textValue={textValue}
      textOnChange={e => dispatch(actions.filterByText(e.target.value))}
    >
      <MetadataFilter
        title="WGSA Species"
        summary={filters.wgsaSpecies}
        onClick={value => dispatch(actions.filterByMetadata(speciesFilter.key, value))}
      />
      <MetadataFilter
        title="Other Species"
        summary={filters.otherSpecies}
        onClick={value => dispatch(actions.filterByMetadata(speciesFilter.key, value))}
      />
      <MetadataFilter
        title="Country"
        summary={filters.country}
        onClick={value => dispatch(actions.filterByMetadata(countryFilter.key, value))}
      />
      <DateFilter
        min={filters.date.min}
        max={filters.date.max}
        years={filters.date.years}
        onChangeMin={value => dispatch(actions.filterByMetadata('minDate', value))}
        onChangeMax={value => dispatch(actions.filterByMetadata('maxDate', value))}
      />
    </FilterAside>
  )
);
