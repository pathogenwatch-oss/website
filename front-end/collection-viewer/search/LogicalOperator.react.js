import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getSearch } from './selectors';

import { selectNextOperator } from './actions';

const LogicalOperator = ({ operator, active, onClick }) => (
  <button
    className={classnames('mdl-chip', { 'mdl-chip--active': active })}
    onClick={onClick}
  >
    <span className="mdl-chip__text">{operator}</span>
  </button>
);

function mapStateToProps(state, { index }) {
  return {
    active: getSearch(state).currentIntersection === index,
  };
}

function mapDispatchToProps(dispatch, { index }) {
  return {
    onClick: () => dispatch(selectNextOperator(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogicalOperator);
