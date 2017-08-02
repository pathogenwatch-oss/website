import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Summary from '../Summary.react';
import ErrorSummary from './ErrorSummary.react';

import * as upload from './selectors';

const Component = React.createClass({

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
    const { summary, isSpecieationComplete } = this.props;

    if (summary.errored) {
      return <ErrorSummary />;
    }

    if (isSpecieationComplete) {
      const link = this.getGenomesLink();
      return (
        <Summary>
          <div className="wgsa-upload-actions">
            <Link className="mdl-button" to={`${link}&createCollection=1`}>
              Create Collection
            </Link>
            <Link className="mdl-button mdl-button--alt" to={link}>
              View Genomes
            </Link>
          </div>
        </Summary>
      );
    }

    return (
      <Summary />
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

export default connect(mapStateToProps)(Component);
