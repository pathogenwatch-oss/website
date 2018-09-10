import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Clustering from '../../clustering';
import Network from '../../clustering/Network.react';
import ThresholdChart from '../../clustering/ThresholdChart.react';
import ClusterButton from '../../clustering/ClusterButton.react';

import { getSelectedGenomeId, getThreshold } from '../../clustering/selectors';

import * as actions from '../../clustering/actions';

const ClusteringSection = ({ result, selectedGenomeId, threshold, setThreshold }) => (
  <React.Fragment>
    <header className="pw-genome-report-section-header">
      <h2>Core Genome Clustering</h2>
      <a href={result.scheme} target="_blank" rel="noopener">{result.scheme}</a>
    </header>
    <Clustering>
      <div className="pw-cluster-view">
        <Network />
        <p className="pw-cluster-chart-intro">Pick a threshold by clicking on the chart below</p>
        <ThresholdChart setThreshold={setThreshold} />
        <div className="pw-cluster-buttons">
          <ClusterButton genomeId={selectedGenomeId}>Recluster</ClusterButton>
          <Link
            to={`/clustering/${selectedGenomeId}?threshold=${threshold}`}
            className="mdl-button mdl-button--raised mdl-button--colored pw-cluster-buttons-view"
          >
            View Cluster
          </Link>
        </div>
      </div>
    </Clustering>
  </React.Fragment>
);

function mapStateToProps(state) {
  return {
    selectedGenomeId: getSelectedGenomeId(state),
    threshold: getThreshold(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setThreshold: (threshold) => dispatch(actions.setThreshold(threshold)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusteringSection);
