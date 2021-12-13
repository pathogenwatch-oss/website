import React from 'react';
import { connect } from 'react-redux';

import CreateCollectionForm from './Form.react';
import { FormattedName } from '../../organisms';
import Verify from './Verify.react';

import { getSelectedGenomeSummary } from './selectors';

import { setSelection } from '../selection/actions';

const NoGenomes = () => (
  <div className="wgsa-create-collection-message">
    <p>
      To create a collection, please select at list one genome by clicking the checkbox next to the name.
    </p>
  </div>
);

const SelectOrganism = ({ summary, onClick }) => (
  <div className="wgsa-create-collection-message">
    <p>To create a collection, please select <strong>one organism</strong> below:</p>
    <p>
      {Object.keys(summary).map(id =>
        <button
          key={id}
          className="mdl-chip mdl-chip--contact wgsa-inline-chip"
          onClick={() => onClick(summary[id])}
        >
          <span className="mdl-chip__contact">
            {summary[id].length}
          </span>
          <span className="mdl-chip__text">
            <FormattedName organismId={id} title={summary[id][0].organismName} />
          </span>
        </button>
      )}
    </p>
  </div>
);

const CreateCollection = ({ selectedGenomeSummary, onClick }) => {
  const organismIds = Object.keys(selectedGenomeSummary);
  if (organismIds.length === 0) {
    return <NoGenomes />;
  }

  if (organismIds.length === 1) {
    const organismId = organismIds[0];
    const genomes = selectedGenomeSummary[organismId];

    return (
      <Verify organismId={organismId} genomes={genomes}>
        <CreateCollectionForm />
      </Verify>
    );
  }

  return <SelectOrganism summary={selectedGenomeSummary} onClick={onClick} />;
};

function mapStateToProps(state) {
  return {
    selectedGenomeSummary: getSelectedGenomeSummary(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: (genomes) => dispatch(setSelection(genomes)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection);
