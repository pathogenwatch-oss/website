import React from 'react';
import { connect } from 'react-redux';

import CreateCollectionForm from './Form.react';

import { getSelectedGenomeSummary } from './selectors';

import { setSelection } from '../selection/actions';

import { FormattedName } from '../../organisms';

const CreateCollection = React.createClass({

  render() {
    const { selectedGenomeSummary, onClick } = this.props;
    const organismIds = Object.keys(selectedGenomeSummary);
    if (organismIds.length === 0) {
      return <p>Please select a supported organism to create a collection.</p>;
    }

    if (organismIds.length === 1) {
      return <CreateCollectionForm />;
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
                  <FormattedName organismId={id} />
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: genomes => dispatch(setSelection(genomes)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCollection);
