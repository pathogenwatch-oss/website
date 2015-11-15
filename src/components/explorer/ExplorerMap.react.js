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

const ExplorerMap = ({ dimensions, mapProps }) => (
  <section style={assign({}, style, dimensions)}>
    <GoogleMap { ...mapProps } />
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
    mapProps: {
      markerDefs: display.mapMarkers,
      onMapClick,
    },
  };
}

export default connect(mapStateToProps)(ExplorerMap);
