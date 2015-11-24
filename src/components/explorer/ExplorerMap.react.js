import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import GoogleMap from '../GoogleMap.react';

import { activateFilter, resetFilter } from '^/actions/filter';

import MapUtils from '^/utils/Map';

const style = {
  position: 'relative',
};

const ExplorerMap = ({ dimensions, ...mapProps }) => (
  <section style={assign({}, style, dimensions)}>
    <GoogleMap {...mapProps} />
  </section>
);

ExplorerMap.propTypes = {
  dimensions: React.PropTypes.object,
  markerDefs: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ display, entities }) {
  const { mapMarkers, colourColumn } = display;
  const { assemblies } = entities;

  return {
    mapMarkers,
    colourGetter: colourColumn.valueGetter,
    assemblies,
  };
}

function mapStateToMarker(markerDef, { colourGetter, assemblies }, dispatch) {
  const { assemblyIds } = markerDef;

  markerDef.onClick = () => dispatch(activateFilter(assemblyIds));
  markerDef.icon = MapUtils.getMarkerIcon(
    Array.from(assemblyIds).map(id => assemblies[id]), colourGetter
  );

  return markerDef;
}

function mergeProps({ mapMarkers, ...state }, { dispatch }, props) {
  return {
    ...props,
    markerDefs: mapMarkers.map(def => mapStateToMarker(def, state, dispatch)),
    onMapClick: () => dispatch(resetFilter()),
  };
}

export default connect(mapStateToProps, null, mergeProps)(ExplorerMap);
