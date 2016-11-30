import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';
import LeafletPieChartMarker from '../../cgps-commons/LeafletPieChartMarker.react';

import { filterByLassoPath } from './actions';
import { getPositionExtractor } from './selectors';
import { getMarkers } from './utils';

import { COLLECTION } from '../../app/stateKeys/map';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
} from '../filter/actions';

const ExplorerMap = (props) => (
  <WGSAMap
    className="wgsa-collection-viewer-map"
    stateKey={COLLECTION}
    markers={getMarkers(props)}
    markerComponent={LeafletPieChartMarker}
    onClick={props.onClick}
    onLassoPathChange={props.onLassoPathChange}
    onMarkerClick={props.onMarkerClick}
  >
    {props.children}
  </WGSAMap>
);

import {
  getVisibleAssemblyIds,
  getFilteredAssemblyIds,
  getColourGetter,
} from '../selectors';

function mapStateToProps(state) {
  return {
    assemblies: state.entities.assemblies,
    visibleIds: getVisibleAssemblyIds(state),
    filteredIds: getFilteredAssemblyIds(state),
    colourGetter: getColourGetter(state),
    positionExtractor: getPositionExtractor(state, { stateKey: COLLECTION }),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => dispatch(filterByLassoPath(COLLECTION, null)),
    onLassoPathChange: path => dispatch(filterByLassoPath(COLLECTION, path)),
    onMarkerClick: ({ id, highlighted }, event) => {
      if (event.metaKey || event.ctrlKey) {
        dispatch(highlighted ? removeFromFilter(id) : appendToFilter(id));
      } else {
        dispatch(activateFilter(id));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerMap);
