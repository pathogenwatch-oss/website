/* global google */

import React from 'react';

import GoogleMap from './GoogleMap.react';

import FilteredDataStore from '../../stores/FilteredDataStore';

import FilteredDataActionCreators from '../../actions/FilteredDataActionCreators';

const style = {
  position: 'relative',
};

function onMapClick() {
  FilteredDataActionCreators.clearAssemblyFilter();
}

function onMarkerClick(assemblyIds) {
  FilteredDataActionCreators.setAssemblyIds(assemblyIds);
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
          assemblyIds={this.state.assemblyIds}
          onMapClick={onMapClick}
          onMarkerClick={onMarkerClick} />
      </section>
    );
  },

  handleFilteredDataStoreChange() {
    this.setState({
      assemblyIds: FilteredDataStore.getAssemblyIds(),
    });
  },

});
