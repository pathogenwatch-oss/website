import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import GoogleMap from '../GoogleMap.react';

import { setVisibleAssemblyIds } from '^/actions/filter';

const style = {
  position: 'relative',
};

const ExplorerMap = ({ dimensions, markerDefs, dispatch, showAllAssemblies }) => (
  <section style={assign({}, style, dimensions)}>
    <GoogleMap
      markerDefs={markerDefs}
      onMapClick={() => dispatch(showAllAssemblies())}
    />
  </section>
);

ExplorerMap.propTypes = {
  dimensions: React.PropTypes.object,
  markerDefs: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ display, cache }) {
  return {
    markerDefs: display.mapMarkers,
    showAllAssemblies: () => setVisibleAssemblyIds(cache.allAssemblyIds),
  };
}

export default connect(mapStateToProps)(ExplorerMap);
