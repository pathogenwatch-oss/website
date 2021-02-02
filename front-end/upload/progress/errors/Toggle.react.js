import React from 'react';
import { connect } from 'react-redux';

import Fade from '~/components/fade';

import { getNumberOfProblems } from './selectors';
import { isLoading } from '../selectors';

import { toggleErrors } from './actions';

const Toggle = ({ visible, numProblems, onClick }) => (
  <Fade>
    {visible && (
      <button
        className="pw-pill pw-pill-danger pw-uppercase"
        onClick={onClick}
      >
        {numProblems} problem{numProblems === 1 ? '' : 's'}
      </button>
    )}
  </Fade>
);

function mapStateToProps(state) {
  const numProblems = getNumberOfProblems(state);
  const sessionIsLoading = isLoading(state);
  return {
    numProblems,
    visible: !sessionIsLoading && numProblems > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(toggleErrors()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Toggle);
