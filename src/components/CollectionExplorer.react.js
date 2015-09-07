import React from 'react';

import Layout from './Layout.react';
import DataUtils from '../utils/Data';

const CollectionExplorer = React.createClass({

  propTypes: {
    query: React.PropTypes.object.isRequired,
  },

  getInitialDataFieldThatFiltersMapMarkers: function () {
    const dataObjects = this.state.data;

    const dataFieldsThatFilterMapMarkers = DataUtils.findWhichDataFieldsShouldFilterMapMarkers(dataObjects);

    if (dataFieldsThatFilterMapMarkers.length > 0) {
      return dataFieldsThatFilterMapMarkers[0];
    }

    return null;
  },

  getFilteredIsolates: function (isolateIds) {
    const filteredIsolates = {};
    const unfilteredIsolates = this.state.data;

    isolateIds.forEach(function (isolateId) {
      filteredIsolates[isolateId] = unfilteredIsolates[isolateId];
    });

    return filteredIsolates;
  },

  handleFilterTableData: function (isolateIds) {
    this.setState({
      filteredTableData: this.getFilteredIsolates(isolateIds),
    });
  },

  handleFilterMapAndTableData: function (isolateIds, allCurrentTreeNodeIds) {
    let filteredIsolates;

    if (isolateIds.length === 0) {
      filteredIsolates = this.getFilteredIsolates(allCurrentTreeNodeIds);
    } else {
      filteredIsolates = this.getFilteredIsolates(isolateIds);
    }

    this.setState({
      filteredMapData: filteredIsolates,
      filteredTableData: filteredIsolates,
    });
  },

  handleSelectTreeData: function (isolateIds, allCurrentTreeNodeIds) {
    this.selectIsolatesOnTree(isolateIds);
    this.handleFilterMapAndTableData(isolateIds, allCurrentTreeNodeIds);
  },

  selectIsolatesOnTree: function (isolateIds) {
    if (isolateIds.length > 1) {
      this.setState({
        selectIsolatesOnTree: [],
      });
    } else {
      this.setState({
        selectIsolatesOnTree: isolateIds,
      });
    }
  },

  handleInfoWindowIsolateClick: function (isolateId) {
    this.selectIsolatesOnTree([ isolateId ]);
  },

  handleColourDataByDataField: function (dataField) {
    this.setState({
      colourDataByDataField: dataField,
    });
  },

  handleChangeNodeLabel: function (nodeLabel) {
    this.setState({
      treeNodeLabel: nodeLabel,
    });
  },

  handleTimelineFilterChange: function (filterStartDate, filterEndDate) {
    this.setState({
      filterStartDate: filterStartDate,
      filterEndDate: filterEndDate,
    });
  },

  render: function () {
    return (
      <Layout />
    );
  },

});

module.exports = CollectionExplorer;
