import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Spinner from '../../../components/Spinner.react';
import Notify from '../../../components/Notify.react';
import { Link } from 'react-router-dom';
import { getClusteringStatus, getClusteringProgress, getClusters, getClusteringThreshold, getClusteringEdges, getClusteringEdgesStatus } from '../selectors';
import { requestClustering, updateClusteringProgress, fetchClusters, updateClusteringThreshold, fetchClusterEdges } from '../actions';

import SimpleBarChart from './SimpleBarChart.react';
import SimpleNetwork from './SimpleNetwork.react';

const NODE_COLORS = {
  0: '#673c90',
  1: '#b199c7',
};
NODE_COLORS[-1] = '#9eb8c0';
const EDGE_COLORS = {
  0: '#9a6fc3',
  1: '#e3dbeb',
};
EDGE_COLORS[-1] = '#dae4e7';

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

function normalize(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const diff = max - min;
  if (diff === 0) return arr.map(() => 0.5);
  return arr.map(el => 0.5 + (el - min) / diff);
}

function degreesOfSeparation(edges, rootIdx) {
  const nodes = [];

  let idx = 0;
  for (let a = 0; idx < edges.length; a++) {
    const nodeA = { neighbours: [], explored: false, degrees: undefined };
    nodes.push(nodeA);
    for (let b = 0; b < a; b++) {
      const nodeB = nodes[b];
      if (edges[idx]) {
        nodeA.neighbours.push(nodeB);
        nodeB.neighbours.push(nodeA);
      }
      idx++;
    }
  }

  const root = nodes[rootIdx];
  let frontier = [ root ];

  for (let degrees = 0; degrees <= 2; degrees++) {
    let nextFrontier = [];
    for (let i = 0; i < frontier.length; i++) {
      const node = frontier[i];
      if (node.explored) continue;
      nextFrontier = [ ...nextFrontier, ...node.neighbours ];
      node.degrees = degrees;
      node.explored = true;
    }
    frontier = nextFrontier;
  }

  return nodes.map(_ => _.degrees);
}

const Clustering = React.createClass({
  componentDidMount() {
    const { names, genomeIdx, sts: allSts, clusterIndex } = this.props.clusters || {};
    const { threshold } = this.props;
    if (threshold && names && genomeIdx) {
      const clusters = buildClusters(threshold, clusterIndex);
      const sts = allSts.filter((_, i) => clusters[i] === clusters[genomeIdx]);
      this.props.fetchEdges(this.props.scheme, this.props.genomeId, this.props.threshold, sts);
    }
  },

  componentDidUpdate(prevProps) {
    const params = { ...this.props.clusters };
    params.threshold = this.props.threshold;
    params.status = this.props.status;

    const prevParams = { ...prevProps.clusters };
    prevParams.threshold = prevProps.threshold;
    prevParams.status = prevProps.status;

    if (params.status === 'READY' && prevParams.status !== 'READY') {
      this.props.fetchClusters();
    } else if (
      params.threshold && (params.threshold !== prevParams.threshold) ||
      params.names && (params.names !== prevParams.names) ||
      params.genomeIdx && (params.genomeIdx !== prevParams.genomeIdx)
    ) {
      const clusters = buildClusters(params.threshold, params.clusterIndex);
      const sts = params.sts.filter((_, i) => clusters[i] === clusters[params.genomeIdx]);
      this.props.fetchEdges(this.props.scheme, this.props.genomeId, this.props.threshold, sts);
    }
  },

  renderClusterButton(label = 'Cluster Now', primary = true) {
    return (
      <button
        className={classnames('mdl-button mdl-button--raised', { 'mdl-button--colored': primary })}
        onClick={this.props.requestClustering}
        style={{ marginLeft: '10px' }}
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
        className={classnames('mdl-button mdl-button--raised', { 'mdl-button--colored': false })}
      >
        {label}
      </Link>
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
    return <SimpleBarChart width={584} height={100} labels={thresholds} values={clusterSizes} onClick={onClick} toolTipFunc={toolTipFunc} />;
  },

  _connections() {
    const edges = this.props.edges;
    let idx = 0;
    const connections = [];
    for (let i = 0; idx < edges.length; i++) {
      connections.push(0);
      for (let j = 0; j < i; j++) {
        if (edges[idx]) {
          connections[i]++;
          connections[j]++;
        }
        idx++;
      }
    }
    return connections;
  },

  renderNetwork() {
    const width = 584;
    const height = 320;

    const clusters = buildClusters(this.props.threshold, this.props.clusters.clusterIndex);
    const names = this.props.clusters.names.filter((_, i) => clusters[i] === clusters[this.props.clusters.genomeIdx]);

    if (names.length <= 1) {
      return <div style={{ width: `${width}px`, height: `${height}px` }}><p>Please pick a bigger threshold.</p></div>;
    }

    const { edgesStatus = null } = this.props;
    if (edgesStatus === 'IN PROGRESS' || edgesStatus === 'STALE') {
      return <div style={{ width: `${width}px`, height: `${height}px` }}><p>Fetching cluster...</p><Spinner /></div>;
    } else if (edgesStatus === null) {
      return <p>Please pick a threshold from the chart below</p>;
    } else if (edgesStatus !== 'COMPLETE') {
      return <div style={{ width: `${width}px`, height: `${height}px` }}><p>Couldn't fetch the cluster, try another threshold</p></div>;
    }
    if (!this.props.edges) return <div style={{ width: `${width}px`, height: `${height}px` }}></div>;
    
    // Nodes should be sized according to the number of edges they have
    // They're scaled and normalized to make them look nicer.
    const connections = this._connections();
    const sizes = normalize(connections.map(n => n ** 0.3));
    
    // We need to keep track of the index of the node which is being shown in the genome report
    // In the original list of all sts, it was at the position `genomeIdx` but it's
    // new position among the filtered sts will be smaller.
    const rootSt = this.props.clusters.sts[this.props.clusters.genomeIdx];
    const sts = this.props.clusters.sts.filter((_, i) => clusters[i] === clusters[this.props.clusters.genomeIdx]);
    const rootIdx = sts.indexOf(rootSt);
    const degrees = degreesOfSeparation(this.props.edges, rootIdx);

    const nodes = [];
    const edges = [];
    let idx = 0;
    for (let i = 0; i < names.length; i++) {
      nodes.push({
        _label: names[i].join('|'),
        id: 'n' + i,
        size: sizes[i],
        color: NODE_COLORS[degrees[i]] || NODE_COLORS[-1],
        zIndex: degrees[i],
      });
      for (let j = 0; j < i; j++) {
        if (this.props.edges[idx]) {
          const minDegree = Math.min(degrees[i], degrees[j]);
          edges.push({
            id: 'e' + idx,
            source: 'n'+j,
            target: 'n'+i,
            color: EDGE_COLORS[minDegree] || EDGE_COLORS[-1],
            zIndex: minDegree,
          });
        }
        idx++;
      }
    }

    const onTimeout = (network) => {
      const node = network.network.graph.nodes().find(_ => _.id === 'n'+rootIdx);
      node.label = node._label;
      if (this.modestyEl) this.modestyEl.style.visibility = 'hidden';
      if (this.thresholdEl) this.thresholdEl.style.visibility = 'visible';
      if (network.root) network.root.style.opacity = 1;
    };
    const overNode = ({ data }, network) => {
      data.node.label = data.node._label;
      network.network.refresh();
    };
    const outNode = ({ data }, network) => {
      if (data.node.id === 'n'+rootIdx) return;
      data.node.label = undefined;
      network.network.refresh();
    };

    const events = {
      overNode,
      outNode,
    };

    const timeout = Math.min(Math.max(1000, edges.length / 5), 10000);
    const options = {
      algorithm: 'forceAtlas2',
      timeout,
      onTimeout,
    };

    const style = {
      opacity: 0.2,
      zIndex: 1,
    };

    const setModestyEl = function (el) { this.modestyEl = el }.bind(this);
    const setThresholdEl = function (el) { this.thresholdEl = el }.bind(this);

    return (<div style={{ position: 'relative' }}>
      <SimpleNetwork style={style} width={width} height={height} nodes={nodes} edges={edges} events={events} options={options} />
      <div ref={ setModestyEl } style={{ position: 'absolute', top: '0px', zIndex: 2 }}><p>Rendering cluster...</p><Spinner /></div>
      <div ref={ setThresholdEl } style={{ position: 'absolute', top: '0px', zIndex: 3, visibility: 'hidden' }}><p>Clustered at threshold of { this.props.threshold }</p></div>
    </div>);
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
              return (
                <div style={{ position: 'relative' }}>
                  {this.renderNetwork()}
                  <p style={{ marginTop: 16, marginBottom: 5 }}>Pick a threshold by clicking on the chart below</p>
                  {this.renderChart()}
                  <div style={{ position: 'absolute', right: '0px' }}>
                    {this.renderViewButton()}
                    {this.renderClusterButton('Recluster')}
                  </div>
                </div>
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
    edges: getClusteringEdges(state),
    edgesStatus: getClusteringEdgesStatus(state),
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    updateProgress: (payload) => dispatch(updateClusteringProgress(payload)),
    fetchClusters: () => dispatch(fetchClusters(props.genomeId)),
    requestClustering: () => dispatch(requestClustering(props.scheme)),
    updateThreshold: (threshold) => dispatch(updateClusteringThreshold(threshold)),
    fetchEdges: (scheme, genomeId, threshold, sts) => dispatch(fetchClusterEdges(scheme, genomeId, threshold, sts)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clustering);
