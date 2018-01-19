import React from 'react';
import { connect } from 'react-redux';
import { List } from 'react-virtualized';

import { getSelectedGenomeIds, getSelectedGenomeList } from '../selectors';

import { removeFromSelection, clearSelection, toggleDropdown } from '../actions';

import { showGenomeDrawer, setBinnedFlag } from '../../../genomes/detail/actions';

import config from '../../../app/config';
const { user } = config;

const Selection = ({ selectedGenomes, showGenome, removeGenome, clearAll, sendToBin, toggle }) => (
  <div className="wgsa-genome-selection">
    <header className="wgsa-dropdown-header">
      Selection
      <button
        className="wgsa-button--text wgsa-clear-selection"
        onClick={clearAll}
      >
        Clear All
      </button>
    </header>
    <List
      height={278}
      width={438}
      style={{ overflowX: 'hidden' }}
      className="wgsa-genome-selection-list"
      rowCount={selectedGenomes.length}
      rowHeight={32}
      rowRenderer={({ key, index, style }) => {
        const genome = selectedGenomes[index];
        return (
          <li
            key={key}
            title="Click to View"
            className="wgsa-list-item"
            onClick={() => showGenome(genome)}
            style={{ ...style, width: 440, top: style.top + 8 }}
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
        );
      }}
    />
    <footer className="wgsa-dropdown-footer">
      <div>
        { user &&
          <button
            title="Send Selection to Bin"
            className="mdl-button mdl-button--icon"
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
    removeGenome: genome => dispatch(removeFromSelection([ genome ])),
    showGenome: genome => dispatch(showGenomeDrawer(genome.id, genome.name)),
    sendToBin: genomes => dispatch(setBinnedFlag(genomes, true)),
    toggle: (view) => dispatch(toggleDropdown(view)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
