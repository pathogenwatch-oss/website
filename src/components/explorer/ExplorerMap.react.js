import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import GoogleMap from '../GoogleMap.react';

import { activateFilter, resetFilter } from '^/actions/filter';

const style = {
  position: 'relative',
};

function addClickHandler(markerDef, dispatch) {
  markerDef.onClick = () => dispatch(activateFilter(markerDef.assemblyIds));
  return markerDef;
}

const ExplorerMap = ({ dimensions, markerDefs, dispatch }) => (
  <section style={assign({}, style, dimensions)}>
    <GoogleMap
      markerDefs={markerDefs.map((def) => addClickHandler(def, dispatch))}
      onMapClick={() => dispatch(resetFilter())}
    />
  </section>
);

ExplorerMap.propTypes = {
  dimensions: React.PropTypes.object,
  markerDefs: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ display }) {
  return {
    markerDefs: display.mapMarkers,
  };
}

export default connect(mapStateToProps)(ExplorerMap);
