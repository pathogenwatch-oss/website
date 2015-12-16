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

const inactiveMarkerColours = [ 'transparent' ];

function mapStateToMarker(markerDef, state, dispatch) {
  const { assemblyIds } = markerDef;
  const { colourGetter, assemblies } = state;

  const markerAssemblies = assemblyIds.map(id => assemblies[id]);
  const isCollection = markerAssemblies.some(_ => _.__isCollection);
  const colours = markerAssemblies.reduce(function (memo, assembly) {
    memo.add(colourGetter(assembly));
    return memo;
  }, new Set());

  markerDef.onClick = () => dispatch(activateFilter(assemblyIds));
  markerDef.icon = MapUtils.getMarkerIcon(
    isCollection ? 'circle' : 'square',
    markerDef.active ? colours : inactiveMarkerColours
  );

  markerDef.zIndex = isCollection ? colours.size : 0;

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
