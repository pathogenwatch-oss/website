import React from 'react';
import { connect } from 'react-redux';

import CreateCollection from '../create-collection-form';

import { getSelectedGenomeIds, getSelectedGenomeList, isSelectionOpen } from './selectors';

import { setSelection, unselectGenomes } from './actions';

const Selection = ({ selectedGenomes, removeGenome, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="wgsa-genome-selection">
      {
        selectedGenomes.map(genome =>
          <span
            key={genome.id}
            className="mdl-chip mdl-chip--deletable wgsa-inline-chip"
          >
            <span className="mdl-chip__text">{genome.name}</span>
            <button
              type="button"
              title="Remove genome"
              className="mdl-chip__action"
              onClick={() => removeGenome(genome)}
            >
              <i className="material-icons">remove_circle_outline</i>
            </button>
          </span>
        )
      }
      <CreateCollection />
    </div>
  );
};

function mapStateToProps(state) {
  const selectedGenomes = getSelectedGenomeList(state);
  return {
    selectedGenomes,
    selectedGenomeIds: getSelectedGenomeIds(state),
    isOpen: isSelectionOpen(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearSelection: () => dispatch(setSelection([])),
    removeGenome: genome => dispatch(unselectGenomes([ genome ])),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Selection);
