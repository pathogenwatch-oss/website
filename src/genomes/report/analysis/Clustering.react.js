import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Spinner from '../../../components/Spinner.react';
import Notify from '../../../components/Notify.react';
import { history } from '../../../app/router';
import { getClusteringStatus, getClusteringProgress, getClusters, getClusteringThreshold } from '../selectors';
import { requestClustering, updateClusteringProgress, fetchClusters, updateClusteringThreshold } from '../actions';

import SimpleBarChart from './SimpleBarChart.react';

function buildClusters(threshold, clusterIndex) {
  const { pi, lambda } = clusterIndex;
  const nItems = pi.length;
  const clusters = pi.map(() => 0);
  for (let i = nItems - 1; i >= 0; i--) {
    if (lambda[i] > threshold) clusters[i] = i;
    else clusters[i] = clusters[pi[i]];
  }
  return clusters;
}

const Clustering = React.createClass({
  componentDidUpdate() {
    const { status } = this.props;
    if (status === 'READY') {
      this.props.fetchClusters();
    }
  },

  renderClusterButton(label = 'Cluster Now', primary = true) {
    return (
      <button
        className={classnames('mdl-button mdl-button--raised', { 'mdl-button--colored': primary })}
        onClick={this.props.requestClustering}
      >
        {label}
      </button>
    );
  },

  renderViewButton(label = 'View cluster') {
    const { genomeId, threshold } = this.props;
    const viewClustering = () => history.push(`/clustering/${genomeId}?threshold=${threshold}`);
    return (
      <button
        className={classnames('mdl-button mdl-button--raised', { 'mdl-button--colored': false })}
        onClick={viewClustering}
        style={{ marginLeft: '10px' }}
      >
        {label}
      </button>
    );
  },

  renderChart() {
    const { genomeIdx, clusterIndex } = this.props.clusters;
    const clusterSizes = [];
    const thresholds = [];
    for (let t = 0; t <= 100; t++) {
      const cluster = buildClusters(t, clusterIndex);
      const size = cluster.filter(_ => _ === cluster[genomeIdx]).length;
      clusterSizes.push(size);
      thresholds.push(t);
    }
    const toolTipFunc = (data) => `Cluster of ${data.yLabel} at threshold of ${data.xLabel}`;
    const onClick = ({ label }) => this.props.updateThreshold(label);
    return <SimpleBarChart labels={thresholds} values={clusterSizes} onClick={onClick} toolTipFunc={toolTipFunc} />;
  },

  renderNetwork() {
    return <p>The network</p>;
  },

  render() {
    return (
      <React.Fragment>
        <h2>Core Genome Clustering</h2>
        {(() => {
          switch (this.props.status) {
            case 'ERROR':
              return (
                <React.Fragment>
                  <p>Something went wrong :(</p>
                  {this.renderClusterButton('Try Again', false)}
                </React.Fragment>
              );
            case 'LOADING':
            case 'PENDING':
              return (
                <Notify topic="clustering" onMessage={this.props.updateProgress}>
                  <p>Job queued, please wait ⏳</p><Spinner />
                </Notify>
              );
            case 'IN PROGRESS': {
              const { progress = 0 } = this.props;
              return (
                <Notify topic="clustering" onMessage={this.props.updateProgress}>
                  <p>Running ({progress.toFixed(1)}%)</p><Spinner />
                </Notify>
              );
            }
            case 'READY':
              return (
                <React.Fragment>
                  <p>Fetching result...</p><Spinner />
                </React.Fragment>
              );
            case 'COMPLETE': {
              const { clusters } = this.props;
              window.clusters = clusters;
              return (
                <React.Fragment>
                  {this.renderChart()}
                  <p style={{ marginTop: '5px' }}>Selected clustering at threshold of { this.props.threshold }</p>
                  {this.renderNetwork()}
                  {this.renderClusterButton('Recluster')}
                  {this.renderViewButton()}
                </React.Fragment>
              );
            }
            default:
              return (
                <React.Fragment>
                  <p>Clusters have not yet been determined for this genome.</p>
                  {this.renderClusterButton()}
                </React.Fragment>
              );
          }
        })()}
      </React.Fragment>
    );
  },

});

function mapStateToProps(state) {
  return {
    status: getClusteringStatus(state),
    progress: getClusteringProgress(state),
    clusters: getClusters(state),
    threshold: getClusteringThreshold(state),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    updateProgress: (payload) => dispatch(updateClusteringProgress(payload)),
    fetchClusters: () => dispatch(fetchClusters(props.genomeId)),
    requestClustering: () => dispatch(requestClustering(props.scheme)),
    updateThreshold: (threshold) => dispatch(updateClusteringThreshold(threshold)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
