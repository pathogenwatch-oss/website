import { createSelector } from 'reselect';

import { cluster } from './util';

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

function normalize(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const diff = max - min;
  if (diff === 0) return arr.map(() => 0.5);
  return arr.map(el => 0.5 + (el - min) / diff);
}

const lookupRootIdx = (genomeIdx, clusters, allSts, clusterSts) => {
  // We need to keep track of the index of the node which is being shown in the genome report
  // In the original list of all sts, it was at the position `genomeIdx` but it's
  // new position among the filtered sts will be smaller.
  if (!clusters) return undefined;
  const rootSt = allSts[genomeIdx];
  return clusterSts.indexOf(rootSt);
};

const lookupNodeNames = (genomeIdx, clusters, allNames) => {
  if (!clusters) return undefined;
  return allNames.filter((_, i) => clusters[i] === clusters[genomeIdx]);
};

function calcDegreesOfSeparation(edges, rootIdx) {
  if (!edges) return undefined;
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

function calcNodeEdges(edges) {
  if (!edges) return undefined;
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
}

function calcEdgeDegrees(degrees) {
  if (!degrees) return undefined;
  const edgeDegrees = [];
  for (let i = 1; i < degrees.length; i++) {
    for (let j = 0; j < i; j++) {
      const minDegree = Math.min(degrees[i], degrees[j]);
      edgeDegrees.push(minDegree);
    }
  }
  return edgeDegrees;
}

const getClusterState = state => state.clustering || {};
const getIndex = state => getClusterState(state).index || {}
export const getGenomeId = state => getClusterState(state).genomeId;
export const getStatus = state => getClusterState(state).status;
export const getThreshold = state => getClusterState(state).threshold;
export const getEdges = state => getClusterState(state).edges;
export const getProgress = state => getClusterState(state).progress;
export const getSts = state => getClusterState(state).sts;
export const getGenomeIdx = state => getClusterState(state).genomeIdx;
export const getNames = state => getClusterState(state).names;
export const getSkipMessage = state => getClusterState(state).skipMessage;
export const getEdgesCount = createSelector(
  getEdges,
  edges => (edges || []).length
);
export const getEdgesExist = createSelector(
  getEdgesCount,
  nEdges => nEdges > 0
);
const getClusters = createSelector(
  getThreshold,
  getIndex,
  (threshold, { pi, lambda }) => {
    if ((pi || []).length === 0) return undefined;
    return cluster(threshold, pi, lambda);
  }
);
export const getClusterSts = createSelector(
  getGenomeIdx,
  getSts,
  getClusters,
  (genomeIdx, allSts, clusters) => {
    if (!clusters) return undefined;
    return allSts.filter((_, i) => clusters[i] === clusters[genomeIdx])
  }
);
export const getClusterNodesCount = createSelector(
  getClusterSts,
  sts => (sts || []).length
);
export const getRootIdx = createSelector(
  getGenomeIdx,
  getClusters,
  getSts,
  getClusterSts,
  lookupRootIdx
);
export const getNodeNames = createSelector(
  getGenomeIdx,
  getClusters,
  getNames,
  lookupNodeNames
);
export const getNodeLabels = createSelector(
  getNodeNames,
  nodeNames => (!nodeNames ? undefined : nodeNames.map(_ => _.join('|')))
);
export const getNodeDegrees = createSelector(
  getEdges,
  getRootIdx,
  calcDegreesOfSeparation
);
export const getNodeColors = createSelector(
  getNodeDegrees,
  degrees => (!degrees ? undefined : degrees.map(d => NODE_COLORS[d] || NODE_COLORS[-1]))
);
// Nodes should be sized according to the number of edges they have
export const getNodeEdgeCounts = createSelector(
  getEdges,
  calcNodeEdges
);
// They're scaled and normalized to make them look nicer.
export const getNodeSizes = createSelector(
  getNodeEdgeCounts,
  counts => (!counts ? undefined : normalize(counts.map(n => n ** 0.3)))
);
export const getEdgeDegrees = createSelector(
  getNodeDegrees,
  calcEdgeDegrees
);
export const getEdgeColors = createSelector(
  getEdgeDegrees,
  degrees =>
    (!degrees ? undefined : degrees.map(d => EDGE_COLORS[d] || EDGE_COLORS[-1]))
);
export const getChartThresholds = _ => [ ...Array(100) ].map((__, i) => i);
export const getChartClusterSizes = createSelector(
  getGenomeIdx,
  getChartThresholds,
  getIndex,
  (genomeIdx, thresholds, { pi, lambda }) => {
    if (!pi) return undefined;
    return thresholds.map(t => {
      const thresholdCluster = cluster(t, pi, lambda);
      return thresholdCluster.filter(_ => _ === thresholdCluster[genomeIdx]).length;
    });
  }
);
