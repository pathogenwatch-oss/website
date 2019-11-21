import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import Clustering from '~/clustering';
import Network from '~/clustering/Network.react';
import ThresholdChart from '~/clustering/ThresholdChart.react';
import ClusterButton from '~/clustering/ClusterButton.react';

import {
  getSelectedGenomeId,
  getStatus,
  getThreshold,
} from '~/clustering/selectors';

import * as actions from '~/clustering/actions';

const ClusteringSection = ({
  result,
  selectedGenomeId,
  setThreshold,
  status,
  threshold,
}) => (
  <div className={classnames({ 'pw-genome-report-noprint': status !== 'COMPLETED_LAYOUT' })}>
    <header className="pw-genome-report-section-header">
      <h2>Core genome clustering</h2>
      <p>
        <a href={result.scheme} target="_blank" rel="noopener">
          {result.scheme}
        </a>
      </p>
    </header>
    <Clustering>
      <div className="pw-cluster-view">
        <Network />
        <p className="pw-cluster-chart-intro">
          Pick a threshold by clicking on the chart below
        </p>
        <ThresholdChart setThreshold={setThreshold} />
        <div className="pw-cluster-buttons">
          <ClusterButton genomeId={selectedGenomeId}>Recluster</ClusterButton>
          <Link
            to={`/clustering/${selectedGenomeId}?threshold=${threshold}`}
            className="mdl-button mdl-button--raised mdl-button--colored pw-cluster-buttons-view"
          >
            View cluster
          </Link>
        </div>
      </div>
    </Clustering>
  </div>
);

function mapStateToProps(state) {
  return {
    selectedGenomeId: getSelectedGenomeId(state),
    threshold: getThreshold(state),
    status: getStatus(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setThreshold: threshold => dispatch(actions.setThreshold(threshold)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusteringSection);
