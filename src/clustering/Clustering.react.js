import React from 'react';
import { connect } from 'react-redux';

import Network from './Network.react';
import ThresholdChart from './ThresholdChart.react';
import Progress from './Progress.react';
import ClusterButton from './ClusterButton.react';

import * as selectors from './selectors';
import * as actions from './actions';

const TrySomeClustering = () => (
  <div className="pw-cluster-content">
    <p>Clusters have not been calculated for this genome.</p>
    <ClusterButton primary>Run Clustering</ClusterButton>
  </div>
);

const SomethingWentWrong = () => (
  <div className="pw-cluster-content">
    <p>Something went wrong 😞</p>
    <ClusterButton>Try Again</ClusterButton>
  </div>
);

const Clustering = React.createClass({

  componentDidMount() {
    this.update();
  },

  componentDidUpdate(prevProps) {
    this.update(prevProps);
  },

  update(prevProps = {}) {
    const { props } = this;
    if (props.status === 'INITIAL_STATUS' && prevProps.status !== 'INITIAL_STATUS') {
      props.fetch(this.props.selectedGenomeId);
    } else if (props.status === 'BUILT_CLUSTERS' && prevProps.status !== 'BUILT_CLUSTERS') {
      props.fetch(this.props.selectedGenomeId);
    } else if (props.status === 'FETCHED_CLUSTERS' && prevProps.status !== 'FETCHED_CLUSTERS') {
      if (props.numberOfNodesInCluster > 1) props.fetchEdgeMatrix(props);
      else props.skipLayout(this.props.graph.nodes);
    }
  },

  render() {
    const { status } = this.props;
    switch (status) {
      case 'INITIAL_STATUS':
        return <TrySomeClustering />;
      case 'FETCHING_CLUSTERS':
        return (
          <div className="pw-cluster-content">
            <p className="wgsa-blink">
              Checking Status
            </p>
          </div>
        );
      case 'BUILDING_CLUSTERS':
      case 'BUILT_CLUSTERS':
        return <Progress />;
      case 'FETCHED_CLUSTERS':
      case 'FETCHING_EDGES':
      case 'FETCHED_EDGES':
      case 'RUNNING_LAYOUT':
      case 'COMPLETED_LAYOUT':
      case 'SKIP_NETWORK':
        return this.props.children;
      case 'FAILED_FETCHING_CLUSTERS':
        return this.props.triedBuilding ?
          <SomethingWentWrong /> :
          <TrySomeClustering />;
      case 'FAILED_BUILDING_CLUSTERS':
      case 'FAILED_FETCHING_EDGES':
      default:
        return <SomethingWentWrong />;
    }
  },

});

function mapStateToProps(state) {
  return {
    clusterSts: selectors.getClusterSts(state),
    numberOfNodesInCluster: selectors.getNumberOfNodesInCluster(state),
    selectedGenomeId: selectors.getSelectedGenomeId(state),
    status: selectors.getStatus(state),
    threshold: selectors.getThreshold(state),
    triedBuilding: selectors.getTriedBuilding(state),
    scheme: selectors.getScheme(state),
    version: selectors.getVersion(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    build: (selectedGenomeId) => dispatch(actions.build(selectedGenomeId)),
    fetch: (selectedGenomeId) => dispatch(actions.fetch(selectedGenomeId)),
    fetchEdgeMatrix: ({ selectedGenomeId, scheme, version, threshold, clusterSts }) =>
      dispatch(actions.fetchEdgeMatrix(selectedGenomeId, scheme, version, threshold, clusterSts)),
    skipLayout: (network) => dispatch(actions.skipLayout(network)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
