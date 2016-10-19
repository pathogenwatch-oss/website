import React from 'react';
import { connect } from 'react-redux';

import FilterAside from '../filter-aside';

import { filters, actions, selectors } from './filter';

const [ searchRegExp ] = filters;

function mapStateToProps(state) {
  return {
    active: selectors.isActive(state),
    searchText: searchRegExp.getValue(state),
  };
}

export default connect(mapStateToProps)(
  ({ active, searchText, dispatch }) => (
    <FilterAside
      active={active}
      clear={() => dispatch(actions.clearFilter())}
      textValue={searchText}
      textOnChange={e => dispatch(actions.updateFilter(
        searchRegExp.key,
        e.target.value ? new RegExp(e.target.value, 'i') : null
      ))}
    />
  )
);
