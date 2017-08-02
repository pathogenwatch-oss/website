import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Summary as FilterSummary } from '../../filter/summary';

import ErrorSummary from './ErrorSummary.react';

import * as upload from '../selectors';

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

  getGenomesLink() {
    const { uploadedAt, selectedOrganism } = this.props;
    let link = `/genomes?uploadedAt=${uploadedAt}`;
    if (selectedOrganism) link += `&organismId=${selectedOrganism}`;
    return link;
  },

  render() {
    const { summary, isSpecieationComplete, uploadedAt } = this.props;

    if (summary.errored) {
      return <ErrorSummary />;
    }

    if (uploadedAt && isSpecieationComplete) {
      const link = this.getGenomesLink();
      return (
        <FilterSummary className="wgsa-upload-summary">
          <Link className="mdl-button mdl-button--primary" to={link}>View Genomes</Link>
          <Link className="mdl-button" to={`${link}&createCollection=1`}>Create Collection</Link>
        </FilterSummary>
      );
    }

    return (
      <FilterSummary />
    );
  },

});

function mapStateToProps(state) {
  return {
    summary: upload.getSummary(state),
    isSpecieationComplete: upload.isSpecieationComplete(state),
    selectedOrganism: upload.getSelectedOrganism(state),
  };
}

export default connect(mapStateToProps)(Summary);
