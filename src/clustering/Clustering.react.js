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
    const { status } = this.props;
    switch (status) {
      case 'INITIAL_STATUS':
      case 'BUILT_CLUSTERS':
        this.props.fetch(this.props.genomeId);
        break;
      case 'FETCHED_CLUSTERS':
        this.props.fetchEdges(this.props);
        break;
      case 'FETCHED_EDGES':
        this.props.runLayout(this.props.edgesCount, this.network, LAYOUT_OPTIONS);
        break;
      default:
        break;
    }
  },

  componentDidUpdate(prevProps) {
    const { props } = this;
    if (props.status === 'BUILT_CLUSTERS' && prevProps.status !== 'BUILT_CLUSTERS') {
      props.fetch(this.props.genomeId);
    } else if (props.status === 'FETCHED_CLUSTERS' && prevProps.status !== 'FETCHED_CLUSTERS') {
      if (props.clusterNodesCount > 1) props.fetchEdges(props);
      else props.skipNetwork('Please pick a bigger threshold to view a network');
    } else if (props.status === 'FETCHED_EDGES' && prevProps.status !== 'FETCHED_EDGES') {
      props.runLayout(props.edgesCount, this.network, LAYOUT_OPTIONS);
    } else if (
      props.status === 'FAILED_FETCHING_CLUSTERS' &&
      prevProps.status !== 'FAILED_FETCHING_CLUSTERS' &&
      props.triedBuilding === false
    ) {
      props.build(this.props.genomeId);
    }
  },

  renderClusterButton(label = 'Cluster Now', primiary = false) {
    return (
      <button
        className={classnames('mdl-button mdl-button--raised', { 'mdl-button--colored': primiary })}
        onClick={() => this.props.build(this.props.genomeId)}
      >
        {label}
      </button>
    );
  },

  renderViewButton(label = 'View cluster') {
    const { genomeId, threshold } = this.props;
    const link = `/clustering/${genomeId}?threshold=${threshold}`;
    return (
      <Link
        to={link}
        className={classnames('mdl-button mdl-button--raised mdl-button--colored')}
        style={{ marginLeft: '10px' }}
      >
        {label}
      </Link>
    );
  },

  renderChart() {
    const toolTipFunc = (data) => `Cluster of ${data.yLabel} at threshold of ${data.xLabel}`;
    const onClick = ({ label }) => this.props.setThreshold(label);
    return <SimpleBarChart width={584} height={100} labels={this.props.chartThresholds} values={this.props.chartClusterSizes} onClick={onClick} toolTipFunc={toolTipFunc} />;
  },

  renderNetwork() {
    const width = 584;
    const height = 320;

    if (this.props.names.length <= 1) {
      return <div style={{ width: `${width}px`, height: `${height}px` }}><p>Please pick a bigger threshold.</p></div>;
    }

    switch (this.props.status) {
      case 'INITIAL_STATUS':
      case 'BUILDING_CLUSTERS':
      case 'BUILT_CLUSTERS':
      case 'FETCHING_CLUSTERS':
      case 'FETCHED_CLUSTERS':
      case 'FETCHING_EDGES':
        return <div style={{ width: `${width}px`, height: `${height}px` }}><p className="wgsa-blink">Fetching cluster...</p></div>;
      case 'FETCHED_EDGES':
      case 'RUNNING_LAYOUT':
      case 'COMPLETED_LAYOUT':
        break;
      case 'SKIP_NETWORK': {
        if (!this.props.skipMessage) return undefined;
        return <div style={{ width: `${width}px`, height: `${height}px` }}><p>{ this.props.skipMessage }</p></div>;
      }
      case 'FAILED_BUILDING_CLUSTERS':
      case 'FAILED_FETCHING_CLUSTERS':
      case 'FAILED_FETCHING_EDGES':
      default:
        return <div style={{ width: `${width}px`, height: `${height}px` }}><p>Couldn't fetch the cluster, try another threshold</p></div>;
    }
  
    const nodes = [];
    const edges = [];
    let idx = 0;
    for (let i = 0; i < this.props.clusterNodesCount; i++) {
      const showLabel = this.props.status === 'COMPLETED_LAYOUT' && i === this.props.rootIdx;
      const id = `n${i}`;
      nodes.push({
        label: showLabel ? this.props.nodeLabels[i] : undefined,
        _label: this.props.nodeLabels[i],
        id,
        size: this.props.nodeSizes[i],
        color: this.props.nodeColors[i],
        zIndex: this.props.nodeDegrees[i],
        x: (this.props.nodePositions[id] || {}).x,
        y: (this.props.nodePositions[id] || {}).y,
      });
      for (let j = 0; j < i; j++) {
        if (this.props.edges[idx]) {
          edges.push({
            id: `e${idx}`,
            source: `n${j}`,
            target: `n${i}`,
            color: this.props.edgeColors[idx],
            zIndex: this.props.edgeDegrees[idx],
          });
        }
        idx++;
      }
    }

    const overNode = ({ data }) => {
      data.node.label = data.node._label;
      this.network.refresh();
    };
    const outNode = ({ data }) => {
      if (data.node.id === `n${this.props.rootIdx}`) return;
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
      <SimpleNetwork ref={ el => { this.network = (el ? el.network : undefined); }} style={style} width={width} height={height} nodes={nodes} edges={edges} events={events} />
      <p className="pw-network-cover-message">
        { this.props.status === 'RUNNING_LAYOUT' ? <span className="wgsa-blink">Rendering cluster...</span> : `Clustered at threshold of ${this.props.threshold}` }
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
                  <Notify topic="clustering" onMessage={this.props.updateProgress}>
                    <p>Running ({progress.toFixed(1)}%)</p>
                  </Notify>
                );
              }
              return (
                <Notify topic="clustering" onMessage={this.props.updateProgress}>
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
                <div style={{ position: 'relative' }}>
                  {this.renderNetwork()}
                  <p style={{ marginTop: 16, marginBottom: 5 }}>Pick a threshold by clicking on the chart below</p>
                  {this.renderChart()}
                  <div style={{ position: 'absolute', right: '0px' }}>
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
    genomeId: selectors.getGenomeId(state),
    status: selectors.getStatus(state),
    threshold: selectors.getThreshold(state),
    edges: selectors.getEdges(state),
    progress: selectors.getProgress(state),
    sts: selectors.getSts(state),
    genomeIdx: selectors.getGenomeIdx(state),
    names: selectors.getNames(state),
    skipMessage: selectors.getSkipMessage(state),
    nodePositions: selectors.getNodePositions(state),
    edgesCount: selectors.getEdgesCount(state),
    edgesExist: selectors.getEdgesExist(state),
    clusterSts: selectors.getClusterSts(state),
    clusterNodesCount: selectors.getClusterNodesCount(state),
    rootIdx: selectors.getRootIdx(state),
    nodeNames: selectors.getNodeNames(state),
    nodeLabels: selectors.getNodeLabels(state),
    nodeDegrees: selectors.getNodeDegrees(state),
    nodeColors: selectors.getNodeColors(state),
    nodeEdgeCounts: selectors.getNodeEdgeCounts(state),
    nodeSizes: selectors.getNodeSizes(state),
    edgeDegrees: selectors.getEdgeDegrees(state),
    edgeColors: selectors.getEdgeColors(state),
    chartThresholds: selectors.getChartThresholds(state),
    chartClusterSizes: selectors.getChartClusterSizes(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateProgress: (payload) => dispatch(actions.updateProgress(payload)),
    fetch: (genomeId) => dispatch(actions.fetch(genomeId)),
    build: (genomeId) => dispatch(actions.build(genomeId)),
    setThreshold: (threshold) => dispatch(actions.setThreshold(threshold)),
    fetchEdges: ({ genomeId, threshold, clusterSts }) =>
      dispatch(actions.fetchEdges(genomeId, threshold, clusterSts)),
    runLayout: (nEdges, network, options) => dispatch(actions.runLayout(nEdges, network, options)),
    skipNetwork: (message) => dispatch(actions.skipNetwork(message)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
