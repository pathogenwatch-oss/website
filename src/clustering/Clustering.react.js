import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Notify from '../components/Notify.react';

import * as selectors from './selectors';
import * as actions from './actions';

import SimpleBarChart from './SimpleBarChart.react';
import SimpleNetwork from './SimpleNetwork.react';

const LAYOUT_OPTIONS = {
  iterationsPerRender: 100,
  worker: true,
  barnesHutOptimize: false,
};

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
    } else if (props.status === 'FETCHED_EDGES' && prevProps.status !== 'FETCHED_EDGES') {
      props.runLayout(props.edgesCount, this.network, LAYOUT_OPTIONS);
    } else if (
      props.status === 'FAILED_FETCHING_CLUSTERS' &&
      prevProps.status !== 'FAILED_FETCHING_CLUSTERS' &&
      props.triedBuilding === false
    ) {
      props.build(this.props.selectedGenomeId);
    }
  },

  renderClusterButton(label = 'Cluster Now', primary = false) {
    return (
      <button
        className={classnames('mdl-button mdl-button--raised', { 'mdl-button--colored': primary })}
        onClick={() => this.props.build(this.props.selectedGenomeId)}
      >
        {label}
      </button>
    );
  },

  renderViewButton(label = 'View cluster') {
    const { selectedGenomeId, threshold } = this.props;
    const link = `/clustering/${selectedGenomeId}?threshold=${threshold}`;
    return (
      <Link
        to={link}
        className="mdl-button mdl-button--raised mdl-button--colored pw-cluster-buttons-view"
      >
        {label}
      </Link>
    );
  },

  renderChart() {
    const toolTipFunc = (data) => `Cluster of ${data.yLabel} at threshold of ${data.xLabel}`;
    let clickable = false;
    const { status } = this.props;
    if ([ 'FAILED_BUILDING_CLUSTERS', 'FAILED_FETCHING_CLUSTERS', 'FAILED_FETCHING_EDGES', 'COMPLETED_LAYOUT' ].indexOf(status) >= 0) {
      clickable = true;
    }
    const onClick = ({ label }) => {
      if (!clickable) return;
      const clusterSize = this.props.chartClusterSizes[this.props.chartThresholds.indexOf(label)];
      if (clusterSize > 1000) return;
      this.props.setThreshold(label);
    };
    return <SimpleBarChart width={584} height={100} labels={this.props.chartThresholds} values={this.props.chartClusterSizes} onClick={onClick} toolTipFunc={toolTipFunc} />;
  },

  renderNetwork() {
    const width = 584;
    const height = 320;

    const fetchingMessage = <div style={{ width, height }}><p className="wgsa-blink">Fetching cluster...</p></div>;
    const errorMessage = <div style={{ width, height }}><p>Couldn't fetch the cluster, try another threshold</p></div>;

    switch (this.props.status) {
      case 'INITIAL_STATUS':
      case 'BUILDING_CLUSTERS':
      case 'BUILT_CLUSTERS':
      case 'FETCHING_CLUSTERS':
      case 'FETCHING_EDGES':
      case 'FETCHED_CLUSTERS':
        return fetchingMessage;
      case 'FETCHED_EDGES':
      case 'RUNNING_LAYOUT':
      case 'COMPLETED_LAYOUT':
        break;
      case 'FAILED_BUILDING_CLUSTERS':
      case 'FAILED_FETCHING_CLUSTERS':
      case 'FAILED_FETCHING_EDGES':
      default:
        return errorMessage;
    }

    const overNode = ({ data }) => {
      data.node.label = data.node._label;
      this.network.refresh();
    };
    const outNode = ({ data }) => {
      if (data.node.id === `n${this.props.indexOfSelectedInCluster}`) return;
      data.node.label = undefined;
      this.network.refresh();
    };

    const events = {
      overNode: overNode.bind(this),
      outNode: outNode.bind(this),
    };

    const style = {
      zIndex: 1,
      opacity: this.props.status === 'RUNNING_LAYOUT' ? 0.3 : 1,
    };

    return (<div style={{ position: 'relative' }}>
      <SimpleNetwork ref={ el => { this.network = (el ? el.network : undefined); }} style={style} width={width} height={height} graph={this.props.graph} events={events} />
      <p className="pw-network-cover-message">
        { this.props.status === 'RUNNING_LAYOUT' ? <span className="wgsa-blink">Rendering cluster...</span> : `${this.props.numberOfNodesInCluster} clustered at threshold of ${this.props.threshold}` }
      </p>
    </div>);
  },

  render() {
    const trySomeClustering = (
      <React.Fragment>
        <p>Clusters have not yet been determined for this genome.</p>
        {this.renderClusterButton('Cluster Now', true)}
      </React.Fragment>
    );
    const somethingWentWrong = (
      <React.Fragment>
        <p>Something went wrong :(</p>
        {this.renderClusterButton('Try Again', false)}
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <h2>Core Genome Clustering</h2>
        {(() => {
          switch (this.props.status) {
            case 'INITIAL_STATUS':
              return trySomeClustering;
            case 'FETCHING_CLUSTERS':
            case 'BUILDING_CLUSTERS':
            case 'BUILT_CLUSTERS': {
              const { progress = 0 } = this.props;
              if (progress > 0) {
                return (
                  <Notify room={this.props.taskId} topic="clustering" onMessage={this.props.updateProgress}>
                    <p>Running ({progress.toFixed(1)}%)</p>
                  </Notify>
                );
              }
              return (
                <Notify room={this.props.taskId} topic="clustering" onMessage={this.props.updateProgress}>
                  <p>Job queued, please wait <span className="wgsa-blink">⏳</span></p>
                </Notify>
              );
            }
            case 'FETCHED_CLUSTERS':
            case 'FETCHING_EDGES':
            case 'FETCHED_EDGES':
            case 'RUNNING_LAYOUT':
            case 'COMPLETED_LAYOUT':
            case 'SKIP_NETWORK':
              return (
                <div className="pw-cluster-view">
                  {this.renderNetwork()}
                  <p className="pw-cluster-chart-intro">Pick a threshold by clicking on the chart below</p>
                  {this.renderChart()}
                  <div className="pw-cluster-buttons">
                    {this.renderClusterButton('Recluster')}
                    {this.renderViewButton()}
                  </div>
                </div>
              );
            case 'FAILED_FETCHING_CLUSTERS':
              return this.props.triedBuilding ? somethingWentWrong : trySomeClustering;
            case 'FAILED_BUILDING_CLUSTERS':
            case 'FAILED_FETCHING_EDGES':
            default:
              return somethingWentWrong;
          }
        })()}
      </React.Fragment>
    );
  },

});

function mapStateToProps(state) {
  return {
    chartClusterSizes: selectors.getChartClusterSizes(state),
    chartThresholds: selectors.getChartThresholds(state),
    clusterNodeColors: selectors.getClusterNodeColors(state),
    clusterNodeDegrees: selectors.getClusterNodeDegrees(state),
    clusterNodeLabels: selectors.getClusterNodeLabels(state),
    clusterNodeSizes: selectors.getClusterNodeSizes(state),
    clusterSts: selectors.getClusterSts(state),
    edgeColors: selectors.getEdgeColors(state),
    edgesCount: selectors.getEdgesCount(state),
    edgesExist: selectors.getEdgesExist(state),
    edgesMatrix: selectors.getEdgeMatrix(state),
    graph: selectors.getGraph(state),
    indexOfSelectedInCluster: selectors.getIndexOfSelectedInCluster(state),
    minDegreeForEdge: selectors.getMinDegreeForEdge(state),
    nodeCoordinates: selectors.getNodeCoordinates(state),
    numberOfNodesInCluster: selectors.getNumberOfNodesInCluster(state),
    progress: selectors.getProgress(state),
    selectedGenomeId: selectors.getSelectedGenomeId(state),
    skipMessage: selectors.getSkipMessage(state),
    status: selectors.getStatus(state),
    taskId: selectors.getTaskId(state),
    threshold: selectors.getThreshold(state),
    triedBuilding: selectors.getTriedBuilding(state),
    scheme: selectors.getScheme(state),
    version: selectors.getVersion(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: (payload) => dispatch(actions.updateProgress(payload)),
    fetch: (selectedGenomeId) => dispatch(actions.fetch(selectedGenomeId)),
    build: (selectedGenomeId) => dispatch(actions.build(selectedGenomeId)),
    setThreshold: (threshold) => dispatch(actions.setThreshold(threshold)),
    fetchEdgeMatrix: ({ selectedGenomeId, scheme, version, threshold, clusterSts }) =>
      dispatch(actions.fetchEdgeMatrix(selectedGenomeId, scheme, version, threshold, clusterSts)),
    runLayout: (nEdges, network, options) => dispatch(actions.runLayout(nEdges, network, options)),
    skipLayout: (network) => dispatch(actions.skipLayout(network)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
