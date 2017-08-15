import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';
import LeafletPieChartMarker, { isMarker } from '../../cgps-commons/LeafletPieChartMarker.react';
import MarkerControls from '../../cgps-commons/LeafletMarkerControls.react';

import { getMarkerSize, getLassoPath } from '../../map/selectors';
import { getPositionExtractor } from './selectors';

import { viewByCountry, markerSizeChanged } from '../../map/actions';
import { filterByLassoPath } from './actions';

import { buttonClassname, activeButtonClassname } from '../../map/Map.react';
import { getMarkers } from './utils';

import { COLLECTION as stateKey } from '../../app/stateKeys/map';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
  resetFilter,
} from '../filter/actions';

import { getGenomes } from '../../collection-viewer/selectors';
import {
  getActiveGenomeIds,
  getHighlightedIds,
  getColourGetter,
} from '../selectors';

import { filterKeys } from '../filter/constants';

function mapStateToProps(state) {
  return {
    genomes: getGenomes(state),
    visibleIds: getActiveGenomeIds(state),
    filteredIds: getHighlightedIds(state),
    colourGetter: getColourGetter(state),
    positionExtractor: getPositionExtractor(state, { stateKey }),
    markerSize: getMarkerSize(state, { stateKey }),
    lassoPath: getLassoPath(state, { stateKey }),
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
      if (isMarker(originalEvent.target)) return;
      if (mappedState.lassoPath) {
        dispatch(filterByLassoPath(stateKey, null));
      }
      dispatch(resetFilter(filterKeys.HIGHLIGHT));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  (props) => (
    <WGSAMap
      className="wgsa-collection-viewer-map"
      stateKey={stateKey}
      lassoPath={props.lassoPath}
      markers={getMarkers(props)}
      markerComponent={LeafletPieChartMarker}
      markerSize={props.markerSize}
      onClick={props.onClick}
      onLassoPathChange={props.onLassoPathChange}
      onMarkerClick={props.onMarkerClick}
    >
      {/* {props.children}
      <MarkerControls
        className={buttonClassname}
        activeClassName={activeButtonClassname}
        markerSize={props.markerSize}
        onMarkerSizeChange={props.onMarkerSizeChange}
        onViewByCountryChange={props.onViewByCountryChange}
      /> */}
    </WGSAMap>
  )
);
