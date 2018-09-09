import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { getSelectedGenomeId } from './selectors';
import { build } from './actions';

const Button = ({ onClick, children, primary }) => (
  <button
    className={classnames('mdl-button mdl-button--raised', { 'mdl-button--colored': primary })}
    onClick={onClick}
  >
    {children}
  </button>
);

function mapStateToProps(state) {
  return {
    genomeId: getSelectedGenomeId(state),
  };
}

function mergeProps({ genomeId }, { dispatch }, props) {
  return {
    ...props,
    onClick: () => dispatch(build(genomeId)),
  };
}

export default connect(mapStateToProps, null, mergeProps)(Button);
