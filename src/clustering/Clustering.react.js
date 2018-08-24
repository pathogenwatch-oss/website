import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import Network from 'libmicroreact/network';
import SimpleBarChart from './SimpleBarChart.react';
import Progress from './Progress.react';

import * as selectors from './selectors';
import * as actions from './actions';
import { showToast } from '../toast';

import * as constants from './constants';

function getClusterDescription(numberOfNodes, threshold) {
  return `Cluster of ${numberOfNodes} at threshold of ${threshold}`;
}

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
      this.runLayout();
    }
  },

  runLayout() {
    const { runLayout, edgesCount } = this.props;
    runLayout(edgesCount, this.network, constants.LAYOUT_OPTIONS);
  },

  overNode({ data }) {
    data.node.label = data.node._label;
    this.network.refresh();
  },

  outNode({ data }) {
    if (data.node.id === `n${this.props.indexOfSelectedInCluster}`) return;
    data.node.label = undefined;
    this.network.refresh();
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
    const toolTipFunc = (data) => getClusterDescription(data.yLabel, data.xLabel);
    let clickable = false;
    const { status } = this.props;
    if ([ 'FAILED_BUILDING_CLUSTERS', 'FAILED_FETCHING_CLUSTERS', 'FAILED_FETCHING_EDGES', 'COMPLETED_LAYOUT' ].indexOf(status) >= 0) {
      clickable = true;
    }
    const onClick = ({ label }) => {
      if (!clickable) return;
      const clusterSize = this.props.numberOfNodesAtThreshold[this.props.chartThresholds.indexOf(label)];
      if (clusterSize > constants.MAX_CLUSTER_SIZE) {
        this.props.showToast('This cluster is too large to display, please select a lower threshold.');
        return;
      }
      this.props.setThreshold(label);
    };
    return (
      <SimpleBarChart
        width={584}
        height={100}
        labels={this.props.chartThresholds}
        values={this.props.chartValues}
        onClick={onClick}
        toolTipFunc={toolTipFunc}
        backgroundColor={this.props.chartColours.status}
        hoverBackgroundColor={this.props.chartColours.hover}
      />
    );
  },

  renderNetwork() {
    const width = '100%';
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

    const style = {
      width,
      height,
      zIndex: 1,
      opacity: this.props.status === 'RUNNING_LAYOUT' ? 0.3 : 1,
    };

    const { numberOfGenomesInCluster, threshold } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        <Network
          ref={ el => { this.network = (el ? el.network : undefined); }}
          style={style}
          graph={this.props.graph}
          onNodeHover={this.overNode}
          onNodeLeave={this.outNode}
          settings={constants.NETWORK_SETTINGS}
          shuffleNodes={this.runLayout}
        />
        <p className="pw-network-cover-message">
          { this.props.status === 'RUNNING_LAYOUT' ?
            <span className="wgsa-blink">Rendering cluster...</span> :
            getClusterDescription(numberOfGenomesInCluster, threshold) }
        </p>
      </div>
    );
  },

  render() {
    const trySomeClustering = (
      <div className="pw-cluster-content">
        <p>Clusters have not been calculated for this genome.</p>
        {this.renderClusterButton('Run Clustering', true)}
      </div>
    );
    const somethingWentWrong = (
      <div className="pw-cluster-content">
        <p>Something went wrong 😞</p>
        {this.renderClusterButton('Try Again', false)}
      </div>
    );
    return (
      <React.Fragment>
        <h2>Core Genome Clustering</h2>
        {(() => {
          switch (this.props.status) {
            case 'INITIAL_STATUS':
              return trySomeClustering;
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
    chartValues: selectors.getNumberOfGenomesAtThreshold(state),
    chartThresholds: selectors.getChartThresholds(state),
    numberOfNodesAtThreshold: selectors.getNumberOfNodesAtThreshold(state),
    chartColours: selectors.getChartColours(state),
    clusterSts: selectors.getClusterSts(state),
    edgesCount: selectors.getEdgesCount(state),
    graph: selectors.getGraph(state),
    indexOfSelectedInCluster: selectors.getIndexOfSelectedInCluster(state),
    numberOfNodesInCluster: selectors.getNumberOfNodesInCluster(state),
    numberOfGenomesInCluster: selectors.getNumberOfGenomesInCluster(state),
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
    fetch: (selectedGenomeId) => dispatch(actions.fetch(selectedGenomeId)),
    build: (selectedGenomeId) => dispatch(actions.build(selectedGenomeId)),
    setThreshold: (threshold) => dispatch(actions.setThreshold(threshold)),
    fetchEdgeMatrix: ({ selectedGenomeId, scheme, version, threshold, clusterSts }) =>
      dispatch(actions.fetchEdgeMatrix(selectedGenomeId, scheme, version, threshold, clusterSts)),
    runLayout: (nEdges, network, options) => dispatch(actions.runLayout(nEdges, network, options)),
    skipLayout: (network) => dispatch(actions.skipLayout(network)),
    showToast: (message) => dispatch(showToast({ message })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
