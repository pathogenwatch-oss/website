import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGenomeList } from '../selection/selectors';

import { setBinnedFlag } from './actions';

const RestoreFromBin = ({ selectedGenomes, disabled, restore }) => (
  <button
    disabled={disabled}
    className="mdl-button mdl-button--primary"
    onClick={() => restore(selectedGenomes)}
    title={disabled ? 'Select Genomes to Restore' : 'Restore Selected Genomes'}
  >
    Restore From Bin
  </button>
);

function mapStateToProps(state) {
  const selectedGenomes = getSelectedGenomeList(state);
  return {
    selectedGenomes,
    disabled: selectedGenomes.length === 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    restore: genomes => dispatch(setBinnedFlag(genomes, false)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RestoreFromBin);
