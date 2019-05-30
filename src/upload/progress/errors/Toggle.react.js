import React from 'react';
import { connect } from 'react-redux';

import Fade from '~/components/fade';

import { getNumberOfProblems } from './selectors';

import { toggleErrors } from './actions';

const Toggle = ({ numProblems, onClick }) => (
  <Fade>
    {numProblems > 0 && (
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
  return {
    numProblems: getNumberOfProblems(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(toggleErrors()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Toggle);
