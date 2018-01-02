import React from 'react';
import { connect } from 'react-redux';

import { getSelectedGenomeIds, getSelectedGenomeList } from '../selectors';

import { unselectGenomes, clearSelection, toggleDropdown } from '../actions';

import { showGenomeDrawer, setBinnedFlag } from '../../../genomes/detail/actions';

import config from '../../../app/config';
const { user } = config;

const Selection = ({ selectedGenomes, showGenome, removeGenome, clearAll, sendToBin, toggle }) => (
  <div className="wgsa-genome-selection">
    <header>
      Selection
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
              title="Remove from Selection"
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
      <div>
        <button
          title="Clear Selection"
          className="mdl-button mdl-button--icon wgsa-clear-selection"
          onClick={clearAll}
          title="Clear Selection"
        >
          <i className="material-icons">remove_shopping_cart</i>
        </button>
        { user &&
          <button
            title="Send Selection to Bin"
            className="mdl-button mdl-button--icon wgsa-clear-selection"
            onClick={() => sendToBin(selectedGenomes)}
            title="Send to Bin"
          >
            <i className="material-icons">delete_sweep</i>
          </button> }
      </div>
      <button
        className="mdl-button"
        onClick={() => toggle('download')}
      >
        Download
      </button>
      <button
        className="mdl-button mdl-button--raised mdl-button--colored"
        onClick={() => toggle('collection')}
      >
        Create Collection
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
    toggle: (view) => dispatch(toggleDropdown(view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
