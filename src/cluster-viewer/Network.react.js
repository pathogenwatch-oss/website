import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Clustering from '../clustering';
import Network from '../clustering/Network.react';
import ThresholdSlider from './ThresholdSlider.react';

import { getLassoPath, isLassoActive, getLocationThreshold } from './selectors';
import { getHighlightedIds, getFilter, getCollection, hasHighlightedIds } from '../collection-viewer/selectors';
import { getGraph, getNodeData } from '../clustering/selectors';

import { setLassoPath, toggleLassoActive, fetchCluster } from './actions';
import { setHighlight, clearHighlight } from '../collection-viewer/highlight/actions';

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

const onNodeSelect = (props, sts, append) =>
  (dispatch, getState) => {
    if (props.lassoActive && !props.lassoPath) return;

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
      dispatch(setHighlight(ids, append));
    } else if (!props.lassoPath) {
      dispatch(clearHighlight());
    }
  };

const ClusterViewNetwork = React.createClass({

  componentDidUpdate(previous) {
    if (previous.threshold !== this.props.threshold) {
      this.props.fetch(this.props.genomeId, this.props.threshold);
    }
  },

  render() {
    const { props } = this;
    if (props.collectionStatus !== 'READY') return null;
    return (
      <React.Fragment>
        <Clustering>
          <Network
            coverMessage={false}
            graph={props.graph}
            hasLasso
            height={props.height}
            lassoActive={props.lassoActive}
            lassoPath={props.lassoPath}
            onLassoActiveChange={props.onLassoActiveChange}
            onLassoPathChange={path => props.onLassoPathChange(path, props.hasHighlight)}
            onNodeSelect={(sts, append) => props.onNodeSelect(props, sts, append)}
            width={props.width}
          />
        </Clustering>
        <h2 className="pw-cluster-view-current-threshold wgsa-pane-overlay">Threshold of {props.threshold}</h2>
        <ThresholdSlider />
      </React.Fragment>
    );
  },

});

function mapStateToProps(state) {
  const collection = getCollection(state);
  return {
    lassoActive: isLassoActive(state),
    lassoPath: getLassoPath(state),
    graph: getViewerGraph(state),
    threshold: getLocationThreshold(state),
    genomeId: collection.genomeId,
    collectionStatus: collection.status,
    hasHighlight: hasHighlightedIds(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetch: (genomeId, threshold) => dispatch(fetchCluster(genomeId, threshold)),
    onLassoActiveChange: () => dispatch(toggleLassoActive()),
    onLassoPathChange: (path, hasHighlight) => {
      if (path === null && hasHighlight) {
        dispatch(clearHighlight());
        return;
      }
      dispatch(setLassoPath(path));
    },
    onNodeSelect: (props, sts, append) => {
      dispatch(onNodeSelect(props, sts, append));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ClusterViewNetwork);

