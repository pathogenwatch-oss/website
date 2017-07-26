import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Summary as FilterSummary } from '../filter/summary';

import ErrorSummary from './ErrorSummary.react';

import * as uploads from './selectors';

const Summary = React.createClass({

  componentDidUpdate() {
    const { summary } = this.props;
    document.title = [
      'WGSA',
      '|',
      summary.total ? `(${summary.completed}/${summary.total})` : '',
      'Genomes',
    ].join(' ');
  },

  render() {
    const { summary, isSpecieationComplete, uploadedAt } = this.props;

    if (summary.errored) {
      return <ErrorSummary />;
    }

    if (uploadedAt && isSpecieationComplete) {
      return (
        <FilterSummary className="wgsa-upload-summary">
          <Link className="mdl-button mdl-button--primary" to={`/genomes?uploadedAt=${uploadedAt}`}>View Genomes</Link>
          <Link className="mdl-button" to={`/genomes?uploadedAt=${uploadedAt}&createCollection=1`}>Create Collection</Link>
        </FilterSummary>
      );
    }

    return <FilterSummary />;
  },

});

function mapStateToProps(state) {
  return {
    summary: uploads.getSummary(state),
    isSpecieationComplete: uploads.isSpecieationComplete(state),
  };
}

export default connect(mapStateToProps)(Summary);
