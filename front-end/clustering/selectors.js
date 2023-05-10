import { createSelector } from 'reselect';

import { cluster } from './util';
import { MAX_CLUSTER_SIZE } from './constants';
import { isClusterView } from '~/collection-viewer/selectors';
import { getGenomeStyles } from '~/collection-viewer/selectors/styles';
import { DEFAULT } from '~/app/constants';
import { nonResistantColour } from '~/collection-viewer/amr-utils';
import config from '../app/config';

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
  return arr.map((el) => 0.5 + (el - min) / diff);
}

const lookupIndexOfSelectedInCluster = (indexOfSelectedInAll, clusters, allSts, clusterSts) => {
  // We need to keep track of the index of the node which is being shown in the genome report
  // In the original list of all sts, it was at the position `indexOfSelectedInAll` but it's
  // new position among the filtered sts will be smaller.
  if (!clusters) return undefined;
  const rootSt = allSts[indexOfSelectedInAll];
  return clusterSts.indexOf(rootSt);
};

function calcDistanceFromSelected(edgeMatrix, indexOfSelectedInCluster) {
  if (!edgeMatrix) return undefined;
  const nodes = [];
  const MAX_DEGREES = 3;

  let idx = 0;
  for (let a = 0; idx < edgeMatrix.length; a++) {
    const nodeA = { neighbours: [], explored: false, degrees: MAX_DEGREES };
    nodes.push(nodeA);
    for (let b = 0; b < a; b++) {
      const nodeB = nodes[b];
      if (edgeMatrix[idx]) {
        nodeA.neighbours.push(nodeB);
        nodeB.neighbours.push(nodeA);
      }
      idx++;
    }
  }

  const root = nodes[indexOfSelectedInCluster];
  let frontier = [ root ];

  for (let degrees = 0; degrees < MAX_DEGREES; degrees++) {
    let nextFrontier = [];
    for (const node of frontier) {
      if (node.explored) continue;
      nextFrontier = [ ...nextFrontier, ...node.neighbours ];
      node.degrees = degrees;
      node.explored = true;
    }
    frontier = nextFrontier;
  }

  return nodes.map((_) => _.degrees);
}

function calcMinEdgeDistance(degrees) {
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

const getClusterState = (state) => state.clustering || {};
const getIndex = (state) => getClusterState(state).index || {};
export const getSelectedGenomeId = (state) => getClusterState(state).selectedGenomeId;
export const getStatus = (state) => getClusterState(state).status;
export const getThreshold = (state) => getClusterState(state).threshold;
export const getTriedBuilding = (state) => getClusterState(state).triedBuilding;
export const getEdgeMatrix = (state) => getClusterState(state).edgeMatrix;
export const getProgress = (state) => getClusterState(state).progress;
const getAllSts = (state) => getClusterState(state).allSchemeSts;
export const getIndexOfSelectedInAll = (state) => getClusterState(state).indexOfSelectedInAll;
export const getSkipMessage = (state) => getClusterState(state).skipMessage;
export const getNodeCoordinates = (state) => getClusterState(state).nodeCoordinates || [];
export const getTaskId = (state) => getClusterState(state).taskId;
export const getScheme = (state) => getClusterState(state).scheme;
export const getVersion = (state) => getClusterState(state).version;
export const getOrganismId = (state) => getClusterState(state).organismId;
export const getNodeData = (state) => getClusterState(state).nodes;

export const getMaxThreshold = createSelector(
  getScheme,
  scheme => {
    return scheme in config.maxClusteringThreshold ? config.maxClusteringThreshold[scheme] : config.maxClusteringThreshold.default;
  }
);
export const getEdgesCount = createSelector(
  getEdgeMatrix,
  (edgeMatrix) => (edgeMatrix || []).filter((_) => _ === 1).length
);
export const getEdgesExist = createSelector(
  getEdgesCount,
  (nEdges) => nEdges > 0
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
  getIndexOfSelectedInAll,
  getAllSts,
  getClusters,
  (indexOfSelectedInAll, allSts, clusters) => {
    if (!clusters) return undefined;
    return allSts.filter((_, i) => clusters[i] === clusters[indexOfSelectedInAll]);
  }
);
export const getClusterNodes = createSelector(
  getClusterSts,
  getNodeData,
  (sts = [], nodes) => sts.map((st) => nodes[st])
);
export const getNumberOfNodesInCluster = createSelector(
  getClusterSts,
  (sts) => (sts || []).length
);
export const getIndexOfSelectedInCluster = createSelector(
  getIndexOfSelectedInAll,
  getClusters,
  getAllSts,
  getClusterSts,
  lookupIndexOfSelectedInCluster
);

const getClusterNodeIds = createSelector(
  getIndexOfSelectedInAll,
  getClusters,
  getClusterNodes,
  (indexOfSelectedInAll, clusters, nodes) => {
    if (!clusters) return undefined;
    const nodeIds = [];
    for (let i = 0; i < nodes.length; i++) {
      const { ids } = nodes[i];
      nodeIds.push(ids);
    }
    return nodeIds;
  }
);
export const getClusterNodeLabels = createSelector(
  getClusterNodes,
  (nodes) => {
    if (!nodes) return undefined;
    return nodes.map((node) => {
      if (node.ids.length === 0) return 'Unnamed';
      else if (node.ids.length === 1) return node.label;
      else if (node.ids.length === 2) return `${node.label} and one other`;
      return `${node.label} and ${node.ids.length - 1} others`;
    });
  }
);

export const getClusterNodeDegrees = createSelector(
  getEdgeMatrix,
  getIndexOfSelectedInCluster,
  calcDistanceFromSelected
);

export const getClusterNodeColors = createSelector(
  getClusterNodeDegrees,
  isClusterView,
  getClusterNodes,
  getGenomeStyles,
  (degrees, clusterView, nodes, styles) => {
    const defaultColours = !degrees ? [ NODE_COLORS[0] ] : degrees.map((d) => NODE_COLORS[d] || NODE_COLORS[-1]);
    if (!clusterView) {
      return defaultColours;
    }
    const filterColours = [ NODE_COLORS[0], NODE_COLORS[1], NODE_COLORS[-1] ];
    const testColour = styles[Object.keys(styles)[0]].colour;
    if (filterColours.includes(testColour)) {
      return defaultColours;
    }
    // This is slightly over-engineered to support creating pie chart nodes.
    return nodes
      .map((node) => node.ids) // genome IDs in each nodew
      .map((ids) => {
        const colours = ids.flat()
          .filter((genomeId) => genomeId in styles && styles[genomeId].colour !== nonResistantColour)
          .map((genomeId) => styles[genomeId].colour)
          // .filter(genomeId => genomeId in styles ? styles[genomeId].colour : nonResistantColour)
          .reduce((memo, colour) => {
            if (!memo.hasOwnProperty(colour)) {
              memo[colour] = 0;
            }
            memo[colour] += 1;
            return memo;
          }, {});

        const colourList = Object.keys(colours);
        const colourCount = colourList.length;

        if (colourCount === 0) {
          return nonResistantColour;
        }
        if (colourCount === 1) {
          return colourList[0];
        }
        if (DEFAULT.DANGER_COLOUR in colours) {
          return DEFAULT.DANGER_COLOUR;
        }
        if (DEFAULT.WARNING_COLOUR in colours) {
          return DEFAULT.WARNING_COLOUR;
        }
        const mostCommon = Object.entries(colours).reduce((current, entry) => {
          if (entry[1] > current.max) {
            current.max = entry[1];
            current.best = entry[0];
          }
          return current;
        }, { best: nonResistantColour, max: 0 });
        return mostCommon.best;
      });
  }
);

// They're scaled and normalized to make them look nicer.
export const getClusterNodeSizes = createSelector(
  getClusterNodeIds,
  (names) => (!names ? undefined : normalize(names.map((n) => n.length ** 0.3)))
);
export const getMinDegreeForEdge = createSelector(
  getClusterNodeDegrees,
  calcMinEdgeDistance
);
export const getEdgeColors = createSelector(
  getMinDegreeForEdge,
  (degrees) =>
    (!degrees ? undefined : degrees.map((d) => EDGE_COLORS[d] || EDGE_COLORS[-1]))
);

export const getChartThresholds = createSelector(
  getMaxThreshold,
  (maxThreshold) => [ ...Array(maxThreshold + 1) ].map((__, i) => i)
);

const getNodeGenomeIds = createSelector(
  getAllSts,
  getNodeData,
  (sts, nodes) => (!nodes ? undefined : sts.map((st) => nodes[st].ids))
);

const getNodeGenomeCounts = createSelector(
  getAllSts,
  getNodeData,
  (sts, nodes) => (!nodes ? undefined : sts.map((st) => nodes[st].ids.length))
);

export const getNumberOfGenomesAtThreshold = createSelector(
  getIndexOfSelectedInAll,
  getChartThresholds,
  getIndex,
  getNodeGenomeCounts,
  (indexOfSelectedInAll, thresholds, { pi, lambda }, genomeCounts) => {
    if (!pi) return undefined;
    return thresholds.map((t) => {
      const thresholdCluster = cluster(t, pi, lambda);
      const clusterId = thresholdCluster[indexOfSelectedInAll];
      let size = 0;
      for (let i = 0; i < genomeCounts.length; i++) {
        if (thresholdCluster[i] === clusterId) {
          size += genomeCounts[i];
        }
      }
      return size;
    });
  }
);

export const getGenomeIdsAtThreshold = createSelector(
  getIndexOfSelectedInAll,
  getChartThresholds,
  getIndex,
  getNodeGenomeIds,
  (indexOfSelectedInAll, thresholds, { pi, lambda }, genomeIds) => {
    if (!pi) return undefined;
    return thresholds.map((t) => {
      const thresholdCluster = cluster(t, pi, lambda);
      const clusterId = thresholdCluster[indexOfSelectedInAll];
      const ids = [];
      for (let i = 0; i < genomeIds.length; i++) {
        if (thresholdCluster[i] === clusterId) {
          ids.push(genomeIds[i]);
        }
      }
      return ids;
    });
  }
);

export const getNumberOfNodesAtThreshold = createSelector(
  getIndexOfSelectedInAll,
  getChartThresholds,
  getIndex,
  (indexOfSelectedInAll, thresholds, { pi, lambda }) => {
    if (!pi) return undefined;
    return thresholds.map((t) => {
      const thresholdCluster = cluster(t, pi, lambda);
      const clusterId = thresholdCluster[indexOfSelectedInAll];
      let size = 0;
      for (const id of thresholdCluster) {
        if (id === clusterId) {
          size++;
        }
      }
      return size;
    });
  }
);

export const getNumberOfGenomesInCluster = createSelector(
  getChartThresholds,
  getThreshold,
  getNumberOfGenomesAtThreshold,
  (thresholds = [], threshold, sizes = []) => {
    if (threshold in thresholds) {
      return sizes[thresholds.indexOf(threshold)];
    }
    return undefined;
  }
);

export const getGenomeIdsInCluster = createSelector(
  getChartThresholds,
  getThreshold,
  getGenomeIdsAtThreshold,
  (thresholds = [], threshold, ids = []) => {
    if (threshold in thresholds) {
      return ids[thresholds.indexOf(threshold)].reduce((flattened, hexCodes) => flattened.concat(hexCodes), []);
    }
    return undefined;
  }
);

const colors = {
  disabled: '#ccc',
  active: '#b199c7',
  hover: '#673c90',
};
export const getChartColours = createSelector(
  getNumberOfNodesAtThreshold,
  getThreshold,
  (sizes, threshold) => {
    if (!sizes) return undefined;
    const status = [];
    const hover = [];
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      if (size > MAX_CLUSTER_SIZE) {
        status.push(colors.disabled);
        hover.push(colors.disabled);
      } else {
        status.push(i === threshold ? colors.hover : colors.active);
        hover.push(colors.hover);
      }
    }
    return { status, hover };
  }
);

function calcGraph(status, sts, nodeData, selectedIdx, labels, sizes, nodeColours, nodeZIndex, coordinates, edgesMatrix, edgeColors, edgeZIndex) {
  const nodes = [];
  const edges = [];
  if (!sts) return { nodes, edges };
  const numberOfNodes = sts.length;
  if (numberOfNodes === 0) return { nodes: [], edges: [] };
  if (numberOfNodes === 1) {
    const id = sts[0];
    return {
      nodes: [
        {
          label: labels[0],
          _label: labels[0],
          color: nodeColours[0],
          genomeIds: nodeData[id].ids,
          id,
          size: 1,
          style: {
            colour: NODE_COLORS[0],
            shape: 'circle',
          },
          zIndex: 0,
          x: 0,
          y: 0,
        },
      ],
      edges: [],
    };
  }
  if (!edgesMatrix) return { nodes, edges };
  let idx = 0;
  for (let i = 0; i < numberOfNodes; i++) {
    const showLabel = status === 'COMPLETED_LAYOUT' && i === selectedIdx;
    const id = sts[i];
    nodes.push({
      label: showLabel ? labels[i] : undefined,
      color: showLabel ? nodeColours[i] : undefined,
      hoverLabel: showLabel ? undefined : labels[i],
      id,
      genomeIds: nodeData[id].ids,
      size: sizes[i],
      style: {
        colour: nodeColours[i],
        shape: 'circle',
      },
      zIndex: nodeZIndex[i],
      x: id in coordinates ? coordinates[id].x : Math.cos(2 * i * Math.PI / numberOfNodes),
      y: id in coordinates ? coordinates[id].y : Math.sin(2 * i * Math.PI / numberOfNodes),
    });
    for (let j = 0; j < i; j++) {
      if (edgesMatrix[idx]) {
        edges.push({
          id: `e${idx}`,
          source: sts[j],
          target: sts[i],
          style: {
            colour: edgeColors[idx],
          },
          zIndex: edgeZIndex[idx],
        });
      }
      idx++;
    }
  }
  // Hack to implement something a bit like a zIndex.
  nodes.sort((a, b) => b.zIndex - a.zIndex);
  edges.sort((a, b) => b.zIndex - a.zIndex);
  return { nodes, edges };
}

export const getGraph = createSelector(
  getStatus,
  getClusterSts,
  getNodeData,
  getIndexOfSelectedInCluster,
  getClusterNodeLabels,
  getClusterNodeSizes,
  getClusterNodeColors,
  getClusterNodeDegrees,
  getNodeCoordinates,
  getEdgeMatrix,
  getEdgeColors,
  getMinDegreeForEdge,
  calcGraph,
);
