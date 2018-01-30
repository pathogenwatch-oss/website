import React from 'react';
import { connect } from 'react-redux';

import CreateCollectionForm from './Form.react';
import { FormattedName, taxIdMap } from '../../organisms';

import { getSelectedGenomeSummary } from './selectors';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { setSelection } from '../selection/actions';

const NoSupportedOrganism = ({ deployedOrganisms }) => (
  <div className="wgsa-create-collection-message">
    <p>
      To create a collection, please select genomes identified as one of the following organisms:
    </p>
    <ul className="wgsa-supported-organism-list">
      { Array.from(deployedOrganisms).map(organismId =>
        <li key={organismId}>
          <FormattedName fullName organismId={organismId} />
        </li>
      )}
    </ul>
  </div>
);

const NotEnoughGenomes = ({ organismId, deficit }) => (
  <div className="wgsa-create-collection-message">
    <p>
      Population search is not currently supported for <strong><FormattedName fullName organismId={organismId} /></strong>.
    </p>
    <p>
      At least 3 genomes are required to produce a tree for collections without population search.
    </p>
    <p>Please select <strong>{deficit} more genome{deficit === 1 ? '' : 's'}</strong>.</p>
  </div>
);

const SelectOrganism = ({ summary, onClick }) => (
  <div className="wgsa-create-collection-message">
    <p>To create a collection, please select <strong>one organism</strong> below:</p>
    <p>
      { Object.keys(summary).map(id =>
          <button
            key={id}
            className="mdl-chip mdl-chip--contact wgsa-inline-chip"
            onClick={() => onClick(summary[id])}
          >
            <span className="mdl-chip__contact">
              { summary[id].length }
            </span>
            <span className="mdl-chip__text">
              <FormattedName fullName organismId={id} />
            </span>
          </button>
        ) }
    </p>
  </div>
);

const CreateCollection = ({ selectedGenomeSummary, deployedOrganisms, onClick }) => {
  const organismIds = Object.keys(selectedGenomeSummary);
  if (organismIds.length === 0) {
    return <NoSupportedOrganism deployedOrganisms={deployedOrganisms} />;
  }

  if (organismIds.length === 1) {
    const organismId = organismIds[0];
    const count = selectedGenomeSummary[organismId].length;
    const { uiOptions = {} } = taxIdMap.get(organismId);

    if (uiOptions.noPopulation && count < 3) {
      return <NotEnoughGenomes organismId={organismId} deficit={3 - count} />;
    }
    return <CreateCollectionForm />;
  }

  return <SelectOrganism summary={selectedGenomeSummary} onClick={onClick} />;
};

function mapStateToProps(state) {
  return {
    selectedGenomeSummary: getSelectedGenomeSummary(state),
    deployedOrganisms: getDeployedOrganismIds(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: genomes => dispatch(setSelection(genomes)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection);
