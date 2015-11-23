import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import GoogleMap from '../GoogleMap.react';

import { activateFilter, resetFilter } from '^/actions/filter';

const style = {
  position: 'relative',
};

function addClickHandler(markerDef, filter, dispatch) {
  const { assemblyIds } = markerDef;

  markerDef.onClick = () => dispatch(activateFilter(assemblyIds));

  return markerDef;
}

const ExplorerMap = ({ dimensions, markerDefs, filter, dispatch }) => (
  <section style={assign({}, style, dimensions)}>
    <GoogleMap
      markerDefs={markerDefs.map((def) => addClickHandler(def, filter, dispatch))}
      onMapClick={() => dispatch(resetFilter())}
    />
  </section>
);

ExplorerMap.propTypes = {
  dimensions: React.PropTypes.object,
  markerDefs: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ display, filter }) {
  return {
    markerDefs: display.mapMarkers,
    filter,
  };
}

export default connect(mapStateToProps)(ExplorerMap);
