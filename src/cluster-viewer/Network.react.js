import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Clustering from '../clustering';
import Network from '../clustering/Network.react';

import { getLassoPath } from './selectors';
import { getHighlightedIds, getFilter } from '../collection-viewer/selectors';
import { getGraph } from '../clustering/selectors';

import { setLassoPath, selectNodes } from './actions';

const getViewerGraph = createSelector(
  getGraph,
  getHighlightedIds,
  getFilter,
  (graph, highlightedIds, filter) => {
    for (const node of graph.nodes) {
      node.isHighlighted = node.genomeIds.some(id => highlightedIds.has(id));
      if (filter.active) {
        const isActive = node.genomeIds.some(id => filter.ids.has(id));
        node.isActive = isActive;
        if (node.showLabel) node.label = isActive ? node._label : undefined;
      } else {
        node.isActive = true;
        if (node.showLabel) node.label = node._label;
      }
    }
    return { ...graph };
  }
);

const ClusterViewNetwork = (props) => (
  <Clustering>
    <Network
      coverMessage={false}
      graph={props.graph}
      hasLasso
      lassoPath={props.lassoPath}
      onLassoPathChange={props.onLassoPathChange}
      onNodeSelect={props.onNodeSelect}
    />
  </Clustering>
);

function mapStateToProps(state) {
  return {
    lassoPath: getLassoPath(state),
    graph: getViewerGraph(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onNodeSelect: (ids, append) => dispatch(selectNodes(ids, append)),
    onLassoPathChange: path => dispatch(setLassoPath(path)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterViewNetwork);

