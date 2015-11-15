import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import GoogleMap from '../GoogleMap.react';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

const style = {
  position: 'relative',
};

function onMapClick() {
  FilteredDataActionCreators.clearAssemblyFilter();
}

const ExplorerMap = ({ dimensions, markerDefs }) => (
  <section style={assign({}, style, dimensions)}>
    <GoogleMap markerDefs={markerDefs} onMapClick={onMapClick} />
  </section>
);

ExplorerMap.propTypes = {
  dimensions: React.PropTypes.object,
  mapProps: React.PropTypes.shape({
    markerDefs: React.PropTypes.array,
    onMapClick: React.PropTypes.function,
  }),
};

function mapStateToProps({ display }) {
  return {
    markerDefs: display.mapMarkers,
  };
}

export default connect(mapStateToProps)(ExplorerMap);
