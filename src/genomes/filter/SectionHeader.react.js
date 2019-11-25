import { connect } from 'react-redux';

import FilterHeader from '~/filter/section/FilterHeader.react';

import { getListFilters } from './selectors';

import { updateFilter, filterSummaryList } from './actions';

function mapStateToProps(state, { filterKey }) {
  return {
    value: getListFilters(state)[filterKey],
  };
}

function mapDispatchToProps(dispatch, { filterKey, summary }) {
  return {
    onChange: (e) => dispatch(filterSummaryList(filterKey, e.target.value)),
    onSubmit: (e) => {
      e.preventDefault();
      if (summary.length === 1) {
        dispatch(updateFilter({ [filterKey]: summary[0].value }));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterHeader);
