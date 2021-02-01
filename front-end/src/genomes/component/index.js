import { connect } from 'react-redux';
import { parse } from 'query-string';

import Genomes from './Genomes.react';

import { getTotalGenomes, getGridItems, getStatus } from '../selectors';
import { isFilterOpen, isActive } from '../filter/selectors';
import { getTotal } from '../summary/selectors';

import { updateFilter, clearFilter } from '../filter/actions';

function mapStateToProps(state, { match }) {
  const { prefilter } = match.params;
  return {
    prefilter,
    hasGenomes: getTotalGenomes(state) > 0,
    items: getGridItems(state),
    total: getTotal(state),
    status: getStatus(state),
    isFilterOpen: isFilterOpen(state),
    filterActive: isActive(state),
  };
}

function mapDispatchToProps(dispatch, { match, location }) {
  const query = parse(location.search);
  const { prefilter } = match.params;
  return {
    fetch: () =>
      dispatch(updateFilter({ prefilter, ...query }, false)),
    clearFilter: () => dispatch(clearFilter()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Genomes);
