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
        if (node.label && !isActive) {
          node.hiddenLabel = node.label;
          node.label = undefined;
        } else if (node.hiddenLabel && isActive) {
          node.label = node.hiddenLabel;
        }
      } else {
        node.isActive = true;
        if (node.hiddenLabel) {
          node.label = node.hiddenLabel;
        }
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
      onNodeSelect={(ids, append) => props.onNodeSelect(props.lassoActive, ids, append)}
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
    onNodeSelect: (lassoActive, ids, append) => {
      if (lassoActive) return;
      if (ids) {
        dispatch(selectNodes(ids, append));
      } else {
        dispatch(resetFilter(filterKeys.HIGHLIGHT));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterViewNetwork);

