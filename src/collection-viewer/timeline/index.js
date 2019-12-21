import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { PureTimeline } from '@cgps/libmicroreact/timeline';

import * as selectors from './selectors';
import { getHighlightedIds } from '../highlight/selectors';
import { getGenomeStyles } from '../selectors/styles';
import { getFilteredGenomeIds } from '../filter/selectors';

import * as actions from '@cgps/libmicroreact/timeline/actions';
import { setHighlight } from '../highlight/actions';

import { createChartData } from '@cgps/libmicroreact/timeline/utils';

const getActivePoints = createSelector(
  selectors.getPoints,
  getFilteredGenomeIds,
  (points, ids) => {
    const activePoints = [];
    for (const point of points) {
      if (ids.includes(point.id)) {
        activePoints.push(point);
      }
    }
    return activePoints;
  }
);

const getChartData = createSelector(
  getActivePoints,
  createChartData
);

function mapStateToProps(state) {
  const tl = selectors.getTimeline(state);
  return {
    hasTimeline: selectors.hasTimeline(state),
    bounds: selectors.getBounds(state),
    chartData: getChartData(state),
    getTooltip: selectors.getTooltipGetter(state),
    highlightedIds: getHighlightedIds(state),
    histogram: selectors.getHistogram(state),
    momentBounds: selectors.getMomentBounds(state),
    nodeSize: tl.nodeSize,
    speed: tl.speed,
    styles: getGenomeStyles(state),
    unit: tl.unit,
    viewport: tl.viewport,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onBoundsChange: value => dispatch(actions.setTimelineBounds(value)),
    onNodeSizeChange: value => dispatch(actions.setTimelineNodeSize(value)),
    onSpeedChange: value => dispatch(actions.setTimelineSpeed(value)),
    onUnitChange: value => dispatch(actions.setTimelineUnit(value)),
    onViewportChange: value => dispatch(actions.setTimelineViewport(value)),
    setHighlightedIds: (ids, merge) => dispatch(setHighlight(ids, merge)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  props => (props.hasTimeline ? <PureTimeline {...props} /> : <div />)
);
