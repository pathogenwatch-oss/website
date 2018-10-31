import React from 'react';
import { connect } from 'react-redux';

import PWMap from '../../map';
import LeafletPieChartMarker, { isMarker } from '../../cgps-commons/LeafletPieChartMarker.react';
import MarkerControls from '../../cgps-commons/LeafletMarkerControls.react';

import { getMarkerSize, getLassoPath } from '../../map/selectors';
import { getMarkers, getMarkerIds } from './selectors';

import { viewByCountry, markerSizeChanged } from '../../map/actions';
import { filterByLassoPath } from './actions';

import { buttonClassname, activeButtonClassname } from '../../map/Map.react';

import { COLLECTION as stateKey } from '../../app/stateKeys/map';

import { hasHighlightedIds } from '../selectors';
import { removeFromHighlight, setHighlight, clearHighlight } from '../highlight/actions';

function mapStateToProps(state) {
  return {
    markerIds: getMarkerIds(state, { stateKey }),
    markerSize: getMarkerSize(state, { stateKey }),
    lassoPath: getLassoPath(state, { stateKey }),
    markers: getMarkers(state, { stateKey }),
    hasHighlight: hasHighlightedIds(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onLassoPathChange: path => dispatch(filterByLassoPath(stateKey, path)),
    onMarkerClick: ({ id, highlighted }, event) => {
      event.stopPropagation();
      if (event.metaKey || event.ctrlKey) {
        dispatch(highlighted ? removeFromHighlight(id) : setHighlight(id, true));
      } else {
        dispatch(setHighlight(id));
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
        dispatch(clearHighlight());
      } else if (mappedState.lassoPath) {
        dispatch(filterByLassoPath(stateKey, undefined));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  (props) => (
    <PWMap
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
    </PWMap>
  )
);
