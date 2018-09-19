import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Clustering from '../clustering';
import Network from '../clustering/Network.react';
import ThresholdSlider from './ThresholdSlider.react';

import { getLassoPath, isLassoActive, getLocationThreshold } from './selectors';
import { getHighlightedIds, getFilter } from '../collection-viewer/selectors';
import { getGraph, getNodeData } from '../clustering/selectors';

import { setLassoPath, toggleLassoActive } from './actions';
import { resetFilter, appendToFilter, activateFilter } from '../collection-viewer/filter/actions';

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

const onNodeSelect = (sts, append) =>
  (dispatch, getState) => {
    let ids;
    if (sts && sts.length) {
      ids = [];
      const state = getState();
      const nodeData = getNodeData(state);
      for (const st of sts) {
        ids.push(...nodeData[st].ids);
      }
    }
    if (ids) {
      dispatch((append ? appendToFilter : activateFilter)(ids, filterKeys.HIGHLIGHT));
    } else {
      dispatch(resetFilter(filterKeys.HIGHLIGHT));
    }
  };

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
      onNodeSelect={(sts, append) =>
        props.onNodeSelect(props.lassoActive && !props.lassoPath, sts, append)}
      width={props.width}
    />
    <h2 className="pw-cluster-view-current-threshold wgsa-pane-overlay">Threshold of {props.threshold}</h2>
    <ThresholdSlider />
  </Clustering>
);

function mapStateToProps(state) {
  return {
    lassoActive: isLassoActive(state),
    lassoPath: getLassoPath(state),
    graph: getViewerGraph(state),
    threshold: getLocationThreshold(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLassoActiveChange: () => dispatch(toggleLassoActive()),
    onLassoPathChange: path => dispatch(setLassoPath(path)),
    onNodeSelect: (lassoActive, sts, append) => {
      if (lassoActive) return;
      dispatch(onNodeSelect(sts, append));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterViewNetwork);

