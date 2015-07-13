var React = require('react');

var Layout = require('./Layout.react');
var DataUtils = require('../utils/Data');
var TimelineUtils = require('../utils/Timeline');

var SpeciesTreeActionCreators = require('../actions/SpeciesTreeActionCreators');
var SpeciesSubtreeActionCreators = require('../actions/SpeciesSubtreeActionCreators');
var UploadedCollectionActionCreators = require('../actions/UploadedCollectionActionCreators');
var PublicCollectionActionCreators = require('../actions/PublicCollectionActionCreators');
var TableActionCreators = require('../actions/TableActionCreators');

var SpeciesSubtreeStore = require('../stores/SpeciesSubtreeStore');
var UploadedCollectionStore = require('../stores/UploadedCollectionStore');

var ProjectViewer = React.createClass({

  propTypes: {
    project: React.PropTypes.object.isRequired,
    query: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      shortId: this.props.project.shortId,
      tree: this.props.project.tree,
      data: this.props.project.data,
      metadata: this.props.project.metadata,

      filteredMapData: this.props.project.data,
      filteredTableData: this.props.project.data,

      filterStartDate: null,
      filterEndDate: null,

      selectIsolatesOnTree: [],

      colourDataByDataField: null,
      treeNodeLabel: null,

      updateLinkError: null
    };
  },

  componentWillMount: function () {
    SpeciesTreeActionCreators.setSpeciesTree();
    SpeciesTreeActionCreators.setSpeciesSubtrees();
    UploadedCollectionActionCreators.setUploadedCollection();
    UploadedCollectionActionCreators.setUploadedCollectionTree();
    PublicCollectionActionCreators.setPublicCollection();
  },

  componentDidMount: function () {
    SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(UploadedCollectionStore.getUploadedCollectionId());
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

      <Layout
        projectTree={this.state.tree}
        analysisTree={this.state.tree}
        isolates={this.state.data}
        selectIsolatesOnTree={this.state.selectIsolatesOnTree}
        handleSelectTreeData={this.handleSelectTreeData}
        treeNodeLabel={this.state.treeNodeLabel}
        handleFilterMapAndTableData={this.handleFilterMapAndTableData}
        colourDataByDataField={this.state.colourDataByDataField}
        handleColourDataByDataField={this.handleColourDataByDataField}
        filteredMapData={this.state.filteredMapData}
        handleFilterTableData={this.handleFilterTableData}
        handleInfoWindowIsolateClick={this.handleInfoWindowIsolateClick}
        metadata={this.state.metadata}
        shortId={this.state.shortId}
        filteredTableData={this.state.filteredTableData}
        handleChangeNodeLabel={this.handleChangeNodeLabel}
        filterStartDate={this.state.filterStartDate}
        filterEndDate={this.state.filterEndDate}
        onTimelineFilterChange={this.handleTimelineFilterChange}
        settings={this.props.query} />
    );
  }
});

module.exports = ProjectViewer;
