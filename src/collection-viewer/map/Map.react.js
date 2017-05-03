import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';
import LeafletPieChartMarker from '../../cgps-commons/LeafletPieChartMarker.react';
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
} from '../filter/actions';

const ExplorerMap = (props) => (
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
    {props.children}
    <MarkerControls
      className={buttonClassname}
      activeClassName={activeButtonClassname}
      markerSize={props.markerSize}
      onMarkerSizeChange={props.onMarkerSizeChange}
      onViewByCountryChange={props.onViewByCountryChange}
    />
  </WGSAMap>
);

import { getGenomes } from '../../collection-viewer/selectors';
import {
  getVisibleGenomeIds,
  getFilteredGenomeIds,
  getColourGetter,
} from '../selectors';

function mapStateToProps(state) {
  return {
    genomes: getGenomes(state),
    visibleIds: getVisibleGenomeIds(state),
    filteredIds: getFilteredGenomeIds(state),
    colourGetter: getColourGetter(state),
    positionExtractor: getPositionExtractor(state, { stateKey }),
    markerSize: getMarkerSize(state, { stateKey }),
    lassoPath: getLassoPath(state, { stateKey }),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: event => {
      if (event.metaKey || event.ctrlKey) return; // helps with inaccurate marker selection

      dispatch(filterByLassoPath(stateKey, null));
    },
    onLassoPathChange: path => dispatch(filterByLassoPath(stateKey, path)),
    onMarkerClick: ({ id, highlighted }, event) => {
      event.stopPropagation();
      if (event.metaKey || event.ctrlKey) {
        dispatch(highlighted ? removeFromFilter(id) : appendToFilter(id));
      } else {
        dispatch(activateFilter(id));
      }
    },
    onMarkerSizeChange: markerSize => dispatch(markerSizeChanged(stateKey, markerSize)),
    onViewByCountryChange:
      active => dispatch(viewByCountry(stateKey, active)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerMap);
