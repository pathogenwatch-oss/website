import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import GoogleMap from '../GoogleMap.react';

import {
  activateFilter,
  appendToFilter,
  removeFromFilter,
  resetFilter,
} from '^/actions/filter';

import MapUtils from '^/utils/Map';
import { createColourGetter } from '^/utils/resistanceProfile';

const style = {
  position: 'relative',
  height: '100%',
  width: '100%',
};

const ExplorerMap = ({ dimensions, ...mapProps }) => (
  <section style={style}>
    <GoogleMap {...mapProps} />
  </section>
);

ExplorerMap.propTypes = {
  dimensions: React.PropTypes.object,
  markerDefs: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ display, collection, tables, entities, filter }) {
  const { mapMarkers } = display;
  const { resistanceProfile } = tables;
  const { assemblies } = entities;

  return {
    mapMarkers,
    colourGetter: createColourGetter(resistanceProfile.activeColumns),
    assemblies,
    collection,
    filter,
  };
}

function mapStateToMarker(markerDef, state, dispatch) {
  const { colourGetter, assemblies, filter } = state;

  const assemblyIds =
    markerDef.assemblyIds.filter(id => filter.unfilteredIds.has(id));
  const markerAssemblies = assemblyIds.map(id => assemblies[id]);
  const isCollection = markerAssemblies.some(_ => _.__isCollection);
  const colours = markerAssemblies.reduce(function (memo, assembly) {
    memo.add(colourGetter(assembly));
    return memo;
  }, new Set());

  markerDef.highlighted =
    filter.active && assemblyIds.some(id => filter.ids.has(id));

  markerDef.onClick = (args) => {
    // Google Maps uses a minified key for the click event, it can change.
    const eventProp = Object.keys(args).find(key => args[key].type === 'click');
    const { ctrlKey, metaKey } = args[eventProp];
    if (ctrlKey || metaKey) {
      return markerDef.highlighted ?
        dispatch(removeFromFilter(assemblyIds)) :
        dispatch(appendToFilter(assemblyIds));
    }
    dispatch(activateFilter(assemblyIds));
  };

  markerDef.iconDef = MapUtils.getMarkerIcon(
    isCollection ? 'circle' : 'square',
    colours,
    markerDef.highlighted
  );

  markerDef.zIndex = (isCollection || markerDef.highlighted) ? colours.size : 0;

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
