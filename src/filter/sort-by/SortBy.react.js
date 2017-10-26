import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getSortActive, getSortOrder } from './selectors';

const SortBy = ({ className, onClick, children, active, sortOrder }) => (
  <button
    onClick={e => { e.preventDefault(); onClick(active ? !sortOrder : true); }}
    className={classnames(className, { active })}
  >
    {children}
    {active &&
      <i className="material-icons">
        {sortOrder ? 'arrow_drop_up' : 'arrow_drop_down'}
      </i>}
  </button>
);

SortBy.PropTypes = {
  stateKey: React.PropTypes.string.isRequired,
  sortKey: React.PropTypes.string.isRequired,
  sortOrder: React.PropTypes.bool,
  onClick: React.PropTypes.func,
};

function mapStateToProps(state, props) {
  return {
    active: getSortActive(state, props),
    sortOrder: getSortOrder(state, props),
  };
}

function mapDispatchToProps(dispatch, { sortKey, update }) {
  return {
    onClick: (sortOrder) => {
      dispatch(update({ sort: `${sortKey}${sortOrder ? '' : '-'}` }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SortBy);
