import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../filter-aside';
import MetadataFilter from '../metadata-filter';

import { filters, actions, selectors } from './filter';
import { getFilterSummary } from './selectors';
import { updateQueryString } from '../location';

const [ searchRegExp, speciesFilter ] = filters;

function mapStateToProps(state) {
  return {
    active: selectors.isActive(state),
    searchText: searchRegExp.getValue(state),
    filterSummary: getFilterSummary(state),
  };
}

export default connect(mapStateToProps)(
  ({ active, searchText, filterSummary, dispatch }) => (
    <FilterAside
      active={active}
      clear={() => dispatch(actions.clearFilter())}
      textValue={searchText}
      textOnChange={e => dispatch(actions.updateFilter(
        searchRegExp.key,
        e.target.value ? new RegExp(e.target.value, 'i') : null
      ))}
    >
      <MetadataFilter
        title="Species"
        summary={filterSummary.species}
        onClick={value => updateQueryString(speciesFilter.key, value)}
      />
    </FilterAside>
  )
);
