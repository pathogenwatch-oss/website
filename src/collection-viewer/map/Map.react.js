import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';
import LeafletPieChartMarker, { isMarker } from '../../cgps-commons/LeafletPieChartMarker.react';
import MarkerControls from '../../cgps-commons/LeafletMarkerControls.react';

import { getMarkerSize, getLassoPath } from '../../map/selectors';
import { getMarkers, getMarkerIds } from './selectors';

import { viewByCountry, markerSizeChanged } from '../../map/actions';
import { filterByLassoPath } from './actions';

import { buttonClassname, activeButtonClassname } from '../../map/Map.react';

import { COLLECTION as stateKey } from '../../app/stateKeys/map';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
  resetFilter,
} from '../filter/actions';

import { filterKeys } from '../filter/constants';
import { getFilterState } from '../selectors';

function mapStateToProps(state) {
  return {
    markerIds: getMarkerIds(state, { stateKey }),
    markerSize: getMarkerSize(state, { stateKey }),
    lassoPath: getLassoPath(state, { stateKey }),
    markers: getMarkers(state, { stateKey }),
    hasHighlight: getFilterState(state)[filterKeys.HIGHLIGHT].active,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLassoPathChange: path => dispatch(filterByLassoPath(stateKey, path)),
    onMarkerClick: ({ id, highlighted }, event) => {
      event.stopPropagation();
      if (event.metaKey || event.ctrlKey) {
        const action = highlighted ? removeFromFilter : appendToFilter;
        dispatch(action(id, filterKeys.HIGHLIGHT));
      } else {
        dispatch(activateFilter(id, filterKeys.HIGHLIGHT));
      }
    },
    onMarkerSizeChange:
      markerSize => dispatch(markerSizeChanged(stateKey, markerSize)),
    onViewByCountryChange:
      active => dispatch(viewByCountry(stateKey, active)),
  };
}

function mergeProps(mappedState, { dispatch, ...mappedDispatch }, ownProps) {
  return {
    ...ownProps,
    ...mappedState,
    ...mappedDispatch,
    onClick: ({ originalEvent }) => {
      if (isMarker(originalEvent.target)) {
        return;
      }
      if (mappedState.hasHighlight) {
        dispatch(resetFilter(filterKeys.HIGHLIGHT));
      } else if (mappedState.lassoPath) {
        dispatch(filterByLassoPath(stateKey, undefined));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  (props) => (
    <WGSAMap
      className="wgsa-collection-viewer-map"
      stateKey={stateKey}
      lassoPath={props.lassoPath}
      markers={props.markers}
      markerIds={props.markerIds}
      markerComponent={LeafletPieChartMarker}
      markerSize={props.markerSize}
      onClick={props.onClick}
      onLassoPathChange={props.onLassoPathChange}
      onMarkerClick={props.onMarkerClick}
    >
      {props.children}
      <MarkerControls
        className={buttonClassname}
        activeClassName={activeButtonClassname}
        markerSize={props.markerSize}
        onMarkerSizeChange={props.onMarkerSizeChange}
        onViewByCountryChange={props.onViewByCountryChange}
      />
    </WGSAMap>
  )
);
