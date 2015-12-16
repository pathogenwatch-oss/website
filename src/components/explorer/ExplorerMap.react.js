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

function mapStateToProps({ display, collection, tables, entities }) {
  const { mapMarkers } = display;
  const { resistanceProfile } = tables;
  const { assemblies } = entities;

  return {
    mapMarkers,
    colourGetter: resistanceProfile.activeColumn.valueGetter,
    assemblies,
    collection,
  };
}

function mapStateToMarker(markerDef, state, dispatch) {
  const { assemblyIds } = markerDef;
  const { colourGetter, assemblies, collection } = state;

  markerDef.onClick = () => dispatch(activateFilter(assemblyIds));
  markerDef.icon = MapUtils.getMarkerIcon(
    assemblyIds.map(id => assemblies[id]),
    colourGetter,
    collection.assemblyIds
  );
  markerDef.zIndex =
    assemblyIds.some(id => collection.assemblyIds.has(id)) ? 1 : 0;

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
