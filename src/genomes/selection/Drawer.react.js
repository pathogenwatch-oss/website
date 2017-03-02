import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import CreateCollectionForm from '../create-collection-form';

import { getSelectedGenomeList, getSelectedGenomeSummary } from './selectors';

import { unselectGenomes } from './actions';

import { FormattedSpeciesName } from '../../species';

function showCreateCollectionForm(selectedGenomeSummary, selectedGenomes, onClick) {
  const speciesIds = Object.keys(selectedGenomeSummary);
  if (speciesIds.length === 0) {
    return <p>Please select a supported species to create a collection.</p>;
  }

  if (speciesIds.length === 1) {
    return <CreateCollectionForm />;
  }

  return (
    <div>
      <p>Please select a <strong>one species only</strong> to create a collection:</p>
      <p>
        { speciesIds.map(id =>
            <button
              key={id}
              className="mdl-chip mdl-chip--contact wgsa-species-chip"
              onClick={() => onClick(
                selectedGenomes.filter(({ speciesId }) => speciesId !== id)
              )}
            >
              <span className="mdl-chip__contact">
                { selectedGenomeSummary[id] }
              </span>
              <span className="mdl-chip__text">
                <FormattedSpeciesName speciesId={id} />
              </span>
            </button>
          ) }
      </p>
    </div>
  );
}

function getSelectionTitle(selectedGenomes) {
  return (
    <span>
      <strong className="wgsa-genome-total">{selectedGenomes.length}</strong>
      {` Genome${selectedGenomes.length === 1 ? '' : 's'} selected`}
    </span>
  );
}

const SelectionDrawer = ({ selectedGenomes, selectedGenomeSummary, onClick }) => (
  <Drawer
    title={getSelectionTitle(selectedGenomes)}
    visible={selectedGenomes.length > 0}
  >
    <div className="wgsa-drawer__content">
      { showCreateCollectionForm(selectedGenomeSummary, selectedGenomes, onClick) }
    </div>
  </Drawer>
);

function mapStateToProps(state) {
  return {
    selectedGenomeSummary: getSelectedGenomeSummary(state),
    selectedGenomes: getSelectedGenomeList(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: genomes => dispatch(unselectGenomes(genomes)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionDrawer);
