import React from 'react';

import Layout from './Layout.react';
import DataUtils from '../utils/Data';

const CollectionExplorer = React.createClass({

  propTypes: {
    query: React.PropTypes.object.isRequired
  },

  getInitialDataFieldThatFiltersMapMarkers: function () {
    var dataObjects = this.state.data;

    var dataFieldsThatFilterMapMarkers = DataUtils.findWhichDataFieldsShouldFilterMapMarkers(dataObjects);
    var firstDataFieldThatFiltersMapMarkers;

    if (dataFieldsThatFilterMapMarkers.length > 0) {
      firstDataFieldThatFiltersMapMarkers = dataFieldsThatFilterMapMarkers[0];
      return firstDataFieldThatFiltersMapMarkers;
    }

    return null;
  },

  getFilteredIsolates: function (isolateIds) {
    var filteredIsolates = {};
    var unfilteredIsolates = this.state.data;

    isolateIds.forEach(function (isolateId) {
      filteredIsolates[isolateId] = unfilteredIsolates[isolateId];
    });

    return filteredIsolates;
  },

  handleFilterTableData: function (isolateIds) {
    var filteredIsolates = this.getFilteredIsolates(isolateIds);

    this.setState({
      filteredTableData: filteredIsolates
    });
  },

  handleFilterMapAndTableData: function (isolateIds, allCurrentTreeNodeIds) {
    var filteredIsolates;

    if (isolateIds.length === 0) {
      filteredIsolates = this.getFilteredIsolates(allCurrentTreeNodeIds);
    } else {
      filteredIsolates = this.getFilteredIsolates(isolateIds);
    }

    this.setState({
      filteredMapData: filteredIsolates,
      filteredTableData: filteredIsolates
    });
  },

  handleSelectTreeData: function (isolateIds, allCurrentTreeNodeIds) {
    this.selectIsolatesOnTree(isolateIds);
    this.handleFilterMapAndTableData(isolateIds, allCurrentTreeNodeIds);
  },

  selectIsolatesOnTree: function (isolateIds) {
    if (isolateIds.length > 1) {
      this.setState({
        selectIsolatesOnTree: []
      });
    } else {
      this.setState({
        selectIsolatesOnTree: isolateIds
      });
    }
  },

  handleInfoWindowIsolateClick: function (isolateId) {
    this.selectIsolatesOnTree([ isolateId ]);
  },

  handleColourDataByDataField: function (dataField) {
    this.setState({
      colourDataByDataField: dataField
    });
  },

  handleChangeNodeLabel: function (nodeLabel) {
    this.setState({
      treeNodeLabel: nodeLabel
    });
  },

  handleTimelineFilterChange: function (filterStartDate, filterEndDate) {
    this.setState({
      filterStartDate: filterStartDate,
      filterEndDate: filterEndDate
    });
  },

  render: function () {
    return (
      <Layout />
    );
  },

});

module.exports = CollectionExplorer;
