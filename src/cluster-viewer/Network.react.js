import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Clustering from '../clustering';
import Network from '../clustering/Network.react';

import { getLassoPath, isLassoActive } from './selectors';
import { getHighlightedIds, getFilter } from '../collection-viewer/selectors';
import { getGraph } from '../clustering/selectors';

import { setLassoPath, selectNodes, toggleLassoActive } from './actions';
import { resetFilter } from '../collection-viewer/filter/actions';

import { filterKeys } from '../collection-viewer/filter/constants';

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
      height={props.height}
      lassoActive={props.lassoActive}
      lassoPath={props.lassoPath}
      onLassoActiveChange={props.onLassoActiveChange}
      onLassoPathChange={props.onLassoPathChange}
      onNodeSelect={props.onNodeSelect}
      width={props.width}
    />
  </Clustering>
);

function mapStateToProps(state) {
  return {
    lassoActive: isLassoActive(state),
    lassoPath: getLassoPath(state),
    graph: getViewerGraph(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLassoActiveChange: () => dispatch(toggleLassoActive()),
    onLassoPathChange: path => dispatch(setLassoPath(path)),
    onNodeSelect: (ids, append) => {
      if (ids) {
        dispatch(selectNodes(ids, append));
      } else {
        dispatch(resetFilter(filterKeys.HIGHLIGHT));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterViewNetwork);

