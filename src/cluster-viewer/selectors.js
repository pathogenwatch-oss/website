import { createSelector } from 'reselect';
import { parse } from 'query-string';

import {
  getGraph,
  getChartThresholds,
  getNumberOfNodesAtThreshold,
  getNumberOfGenomesAtThreshold,
} from '../clustering/selectors';

import { MAX_CLUSTER_SIZE } from '../clustering/constants';

const getClusterView = state => state.viewer.clusterView;

export const getLassoPath = createSelector(
  getClusterView,
  view => view.lassoPath
);

export const isLassoActive = createSelector(
  getClusterView,
  view => view.lassoActive
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

export const getThresholdMarks = createSelector(
  getChartThresholds,
  getNumberOfNodesAtThreshold,
  getNumberOfGenomesAtThreshold,
  (thresholds, nodeTotals, genomeTotals) => {
    const marks = {};
    if (!nodeTotals) return marks;
    let lastMark = null;
    for (let i = 0; i < nodeTotals.length; i++) {
      if (nodeTotals[i] > MAX_CLUSTER_SIZE) break;
      if (lastMark !== genomeTotals[i]) {
        marks[thresholds[i]] = lastMark = genomeTotals[i];
      }
    }
    return marks;
  }
);

export const getLocationThreshold = createSelector(
  state => state.location,
  location => {
    const query = parse(location.search);
    return query.threshold;
  }
);
