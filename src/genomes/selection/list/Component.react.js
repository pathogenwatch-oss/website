import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGenomeIds, getSelectedGenomeList } from '../selectors';

import { unselectGenomes, clearSelection } from '../actions';
import { showGenomeDrawer } from '../../../genome-drawer/actions';

const Selection = ({ selectedGenomes, showGenome, removeGenome, clearAll }) => (
  <div className="wgsa-genome-selection">
    <button className="mdl-button wgsa-clear-selection" onClick={clearAll}>
      Clear All
    </button>
    <h3>Selected Genomes</h3>
    { selectedGenomes.map(genome =>
        <span
          key={genome.id}
          className="mdl-chip mdl-chip--deletable wgsa-inline-chip"
        >
          <button
            className="mdl-chip__text"
            onClick={() => showGenome(genome)}
          >
            {genome.name}
          </button>
          <button
            type="button"
            title="Remove genome"
            className="mdl-chip__action"
            onClick={() => removeGenome(genome)}
          >
            <i className="material-icons">remove_circle_outline</i>
          </button>
        </span>
      ) }
  </div>
);

function mapStateToProps(state) {
  const selectedGenomes = getSelectedGenomeList(state);
  return {
    selectedGenomes,
    selectedGenomeIds: getSelectedGenomeIds(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearAll: () => dispatch(clearSelection()),
    removeGenome: genome => dispatch(unselectGenomes([ genome ])),
    showGenome: genome => dispatch(showGenomeDrawer(genome.id, genome.name)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
