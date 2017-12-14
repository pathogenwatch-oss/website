import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGenomeIds, getSelectedGenomeList } from '../selectors';

import { unselectGenomes, clearSelection } from '../actions';
import { showGenomeDrawer, setBinnedFlag } from '../../../genomes/detail/actions';

const Selection = ({ selectedGenomes, showGenome, removeGenome, clearAll, sendToBin }) => (
  <div className="wgsa-genome-selection">
    <header>
      <h3>Selected Genomes</h3>
      <button
        title="Clear Selection"
        className="mdl-button wgsa-clear-selection"
        onClick={clearAll}
      >
        Clear
      </button>
    </header>
    <div className="wgsa-genome-selection__list">
      <ul>
        {selectedGenomes.map(genome =>
          <li
            key={genome.id}
            title="Click to View"
            className="wgsa-list-item"
            onClick={() => showGenome(genome)}
          >
            <span>{genome.name}</span>
            <button
              title="Remove Genome from Selection"
              onClick={e => {
                e.stopPropagation();
                removeGenome(genome);
              }}
              className="mdl-button mdl-button--icon"
            >
              <i className="material-icons">clear</i>
            </button>
          </li>
        )}
      </ul>
    </div>
    <footer>
      <button
        title="Send Selection to Bin"
        className="mdl-button wgsa-clear-selection"
        onClick={() => sendToBin(selectedGenomes)}
      >
        Send to Bin
      </button>
    </footer>
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
    sendToBin: genomes => dispatch(setBinnedFlag(genomes, true)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
