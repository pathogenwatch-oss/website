import React from 'react';
import { connect } from 'react-redux';

import Drawer from '../../drawer';
import CreateCollectionForm from '../create-collection-form';

import { getSelectedGenomeList, getSelectedGenomeSummary } from './selectors';

import { FormattedSpeciesName } from '../../species';

function mapStateToProps(state) {
  return {
    selectedGenomeSummary: getSelectedGenomeSummary(state),
    selectedGenomes: getSelectedGenomeList(state),
  };
}

function showCreateCollectionForm(selectedGenomeSummary) {
  const speciesIds = Object.keys(selectedGenomeSummary);
  if (speciesIds.length === 0) {
    return <p>Please select a supported species.</p>;
  }

  if (speciesIds.length === 1) {
    return <CreateCollectionForm />;
  }

  return (
    <div>
    { speciesIds.map(id =>
        <button key={id} className="mdl-chip mdl-chip--contact">
          <span className="mdl-chip__contact">{ selectedGenomeSummary[id] }</span>
          <span className="mdl-chip__text">
            <FormattedSpeciesName speciesId={id} />
          </span>
        </button>
      ) }
    </div>
  );
}

export default connect(mapStateToProps)(({ selectedGenomes, selectedGenomeSummary }) => (
  <Drawer
    title={`${selectedGenomes.length} genome${selectedGenomes.length === 1 ? '' : 's'} selected.`}
    visible={selectedGenomes.length > 0}
  >
    { showCreateCollectionForm(selectedGenomeSummary) }
  </Drawer>
));
