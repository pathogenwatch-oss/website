import './styles.css';

import React from 'react';
import { connect } from 'react-redux';

import WGSAMap from '../../map';
import LeafletPieChartMarker from '../../cgps-commons/LeafletPieChartMarker.react';

import { filterByLassoPath } from './actions';
import { getMarkers } from './selectors';

import { COLLECTION } from '../../app/stateKeys/map';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
} from '../filter/actions';

const ExplorerMap = ({ markers, onLassoPathChange, onMarkerClick, onClick }) => (
  <WGSAMap
    className="wgsa-collection-viewer-map"
    stateKey={COLLECTION}
    markers={markers}
    markerComponent={LeafletPieChartMarker}
    onClick={onClick}
    onLassoPathChange={onLassoPathChange}
    onMarkerClick={onMarkerClick}
  />
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
    ids: getFilteredAssemblyIds(state),
    colourGetter: getColourGetter(state),
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

function mergeProps(state, actions) {
  return {
    ...actions,
    markers: [], // getMarkers(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ExplorerMap);
