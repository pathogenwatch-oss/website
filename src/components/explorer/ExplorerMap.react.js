import React from 'react';
import { connect } from 'react-redux';
import assign from 'object-assign';

import GoogleMap from '../GoogleMap.react';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

import MapUtils from '^/utils/Map';

const style = {
  position: 'relative',
};

function onMapClick() {
  FilteredDataActionCreators.clearAssemblyFilter();
}

function onMarkerClick(assemblyIds) {
  FilteredDataActionCreators.setAssemblyIds(assemblyIds);
}

function getMarkerDefs(assemblyIds, combinedAssemblies) {
  return MapUtils.getMarkerDefinitions(
    assemblyIds.map(id => combinedAssemblies[id]), {
      onClick: onMarkerClick,
      // getIcon: FilteredDataStore.getColourTableColumnName() ? MapUtils.resistanceMarkerIcon : undefined,
    }
  );
}

const ExplorerMap = React.createClass({

  displayName: 'ExplorerMap',

  propTypes: {
    dimensions: React.PropTypes.object,
    combinedAssemblies: React.PropTypes.object,
    visibleAssemblyIds: React.PropTypes.array,
  },

  render() {
    const { combinedAssemblies, visibleAssemblyIds, dimensions } = this.props;
    return (
      <section style={assign({}, style, dimensions)}>
        <GoogleMap
          markerDefs={getMarkerDefs(visibleAssemblyIds, combinedAssemblies)}
          onMapClick={onMapClick} />
      </section>
    );
  },

});

function mapStateToProps({ entities }) {
  const { uploaded } = entities.collections;
  return {
    combinedAssemblies: uploaded.assemblies,
    visibleAssemblyIds: uploaded.assemblyIds,
  };
}

export default connect(mapStateToProps)(ExplorerMap);
