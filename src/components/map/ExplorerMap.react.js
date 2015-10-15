/* global google */

import React from 'react';
import assign from 'object-assign';

import GoogleMap from './GoogleMap.react';

import FilteredDataStore from '../../stores/FilteredDataStore';
import ReferenceCollectionStore from '../../stores/ReferenceCollectionStore';
import UploadedCollectionStore from '../../stores/UploadedCollectionStore';

import FilteredDataActionCreators from '../../actions/FilteredDataActionCreators';

import MapUtils from '../../utils/Map';

const style = {
  position: 'relative',
};

function onMapClick() {
  FilteredDataActionCreators.clearAssemblyFilter();
}

function onMarkerClick(assemblyIds) {
  FilteredDataActionCreators.setAssemblyIds(assemblyIds);
}

function getCombinedAssemblies() {
  return assign({}, ReferenceCollectionStore.getAssemblies(), UploadedCollectionStore.getAssemblies());
}

function getMarkerDefs(assemblyIds) {
  const combinedAssemblies = getCombinedAssemblies();
  return MapUtils.getMarkerDefinitions(
    assemblyIds.map(id => combinedAssemblies[id]), {
      onClick: onMarkerClick,
      getIcon: FilteredDataStore.getColourTableColumnName() ? MapUtils.resistanceMarkerIcon : undefined,
    }
  );
}

export default React.createClass({

  propTypes: {
    width: React.PropTypes.any.isRequired,
    height: React.PropTypes.any.isRequired,
  },

  getInitialState() {
    return {
      assemblyIds: FilteredDataStore.getAssemblyIds(),
    };
  },

  componentDidMount() {
    FilteredDataStore.addChangeListener(this.handleFilteredDataStoreChange);
  },

  componentWillUnmount() {
    FilteredDataStore.removeChangeListener(this.handleFilteredDataStoreChange);
  },

  render() {
    style.width = this.props.width;
    style.height = this.props.height;

    return (
      <section style={style}>
        <GoogleMap
          markerDefs={getMarkerDefs(this.state.assemblyIds)}
          onMapClick={onMapClick} />
      </section>
    );
  },

  handleFilteredDataStoreChange() {
    this.setState({ assemblyIds: FilteredDataStore.getAssemblyIds() });
  },

});
