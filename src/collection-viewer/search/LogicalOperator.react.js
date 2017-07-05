import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { getNextOperator } from './selectors';

import { selectNextOperator } from './actions';

const LogicalOperator = ({ operator, active, onClick }) => (
  <button
    className={classnames('mdl-chip', { 'mdl-chip--active': active })}
    onClick={onClick}
  >
    <span className="mdl-chip__text">{operator}</span>
  </button>
);

function mapStateToProps(state, { operator }) {
  return {
    active: getNextOperator(state) === operator,
  };
}

function mapDispatchToProps(dispatch, { operator }) {
  return {
    onClick: () => dispatch(selectNextOperator(operator)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogicalOperator);
