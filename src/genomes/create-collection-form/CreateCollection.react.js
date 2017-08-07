import React from 'react';
import { connect } from 'react-redux';

import CreateCollectionForm from './Form.react';
import { FormattedName } from '../../organisms';

import { getSelectedGenomeSummary } from './selectors';
import { getDeployedOrganismIds } from '../../summary/selectors';

import { setSelection } from '../selection/actions';

const CreateCollection = React.createClass({

  render() {
    const { selectedGenomeSummary, deployedOrganisms, onClick } = this.props;
    const organismIds = Object.keys(selectedGenomeSummary);
    if (organismIds.length === 0) {
      return (
        <div>
          <p>
            Please select a supported organism to create a collection.<br />
            Supported organisms are:
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
    }

    if (organismIds.length === 1) {
      return <CreateCollectionForm visible={this.props.visible} />;
    }

    return (
      <div>
        <p>To create a collection, please select <strong>one organism</strong> below:</p>
        <p>
          { organismIds.map(id =>
              <button
                key={id}
                className="mdl-chip mdl-chip--contact wgsa-inline-chip"
                onClick={() => onClick(selectedGenomeSummary[id])}
              >
                <span className="mdl-chip__contact">
                  { selectedGenomeSummary[id].length }
                </span>
                <span className="mdl-chip__text">
                  <FormattedName fullName organismId={id} />
                </span>
              </button>
            ) }
        </p>
      </div>
    );
  },

});

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
