import { createSelector } from 'reselect';

import { getNodeData, getGraph } from '../clustering/selectors';

const getClusterView = state => state.viewer.clusterView;

export const getLassoPath = createSelector(
  getClusterView,
  view => view.lassoPath
);

export const isLassoActive = createSelector(
  getClusterView,
  view => view.lassoActive
);

const getSelectedNodes = state => getClusterView(state).selectedNodes;

export const getNetworkHighlightedIds = createSelector(
  getSelectedNodes,
  getNodeData,
  (selectedNodes, nodeData) => {
    const ids = [];
    for (const node of selectedNodes) {
      ids.push(...nodeData[node].ids);
    }
    return ids;
  }
);

function pointInsidePolygon(vectors, point) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  let inside = false;
  for (let i = 0, j = vectors.length - 1; i < vectors.length; j = i++) {
    if (((vectors[i].y > point.y) !== (vectors[j].y > point.y)) && (point.x < (vectors[j].x - vectors[i].x) * (point.y - vectors[i].y) / (vectors[j].y - vectors[i].y) + vectors[i].x)) {
      inside = !inside;
    }
  }

  return inside;
}

export const getNetworkFilteredIds = createSelector(
  getLassoPath,
  getGraph,
  (path, graph) => {
    if (path) {
      const ids = [];
      for (const node of graph.nodes) {
        if (node.x && node.y && pointInsidePolygon(path, node)) {
          ids.push(...node.genomeIds);
        }
      }
      return ids;
    }
    return undefined;
  }
);
