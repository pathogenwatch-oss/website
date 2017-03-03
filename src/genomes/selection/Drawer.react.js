import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import CreateCollectionForm from '../create-collection-form';

import { getSelectedGenomeList, getSelectedGenomeSummary } from './selectors';

import { setSelection } from './actions';

import { FormattedSpeciesName } from '../../species';

function showCreateCollectionForm(selectedGenomeSummary, onClick) {
  const speciesIds = Object.keys(selectedGenomeSummary);
  if (speciesIds.length === 0) {
    return <p>Please select a supported species to create a collection.</p>;
  }

  if (speciesIds.length === 1) {
    return <CreateCollectionForm />;
  }

  return (
    <div>
      <p>To create a collection, please select <strong>one species</strong> below:</p>
      <p>
        { speciesIds.map(id =>
            <button
              key={id}
              className="mdl-chip mdl-chip--contact wgsa-species-chip"
              onClick={() => onClick(selectedGenomeSummary[id])}
            >
              <span className="mdl-chip__contact">
                { selectedGenomeSummary[id].length }
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
      <span className="wgsa-genome-total">{selectedGenomes.length}</span>&nbsp;
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
      { showCreateCollectionForm(selectedGenomeSummary, onClick) }
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
    onClick: genomes => dispatch(setSelection(genomes)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionDrawer);
