import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Clustering from '../../clustering';
import ClusterButton from '../../clustering/ClusterButton.react';

import { getSelectedGenomeId, getThreshold } from '../../clustering/selectors';

const ClusteringSection = ({ result, selectedGenomeId, threshold }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Core Genome Clustering</h2>
      <a href={result.scheme} target="_blank" rel="noopener">{result.scheme}</a>
    </header>
    <Clustering />
    <div className="pw-cluster-buttons">
      <ClusterButton genomeId={selectedGenomeId}>Recluster</ClusterButton>
      <Link
        to={`/clustering/${selectedGenomeId}?threshold=${threshold}`}
        className="mdl-button mdl-button--raised mdl-button--colored pw-cluster-buttons-view"
      >
        View Cluster
      </Link>
    </div>
  </React.Fragment>
);

function mapStateToProps(state) {
  return {
    selectedGenomeId: getSelectedGenomeId(state),
    threshold: getThreshold(state),
  };
}

export default connect(mapStateToProps)(ClusteringSection);
