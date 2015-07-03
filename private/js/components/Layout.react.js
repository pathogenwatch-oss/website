var React = require('react');

var Map = require('./Map.react');
var Tree = require('./Tree.react');
var SpeciesTree = require('./SpeciesTree.react');
var Data = require('./Data.react');
var Timeline = require('./Timeline.react');
var Api = require('../utils/Api');

var LayoutContainer = require('./layout/LayoutContainer.react');
var LayoutWest = require('./layout/LayoutWest.react');
var LayoutMiddle = require('./layout/LayoutMiddle.react');

var LayoutEast = require('./layout/LayoutEast.react');
var LayoutNorth = require('./layout/LayoutNorth.react');
var LayoutSouth = require('./layout/LayoutSouth.react');

var LayoutWestMiddleDivider = require('./layout/LayoutWestMiddleDivider.react');
var LayoutMiddleEastDivider = require('./layout/LayoutMiddleEastDivider.react');
var LayoutNorthSouthDivider = require('./layout/LayoutNorthSouthDivider.react');
var LayoutDivider = require('./layout/LayoutDivider.react');

var LayoutUtils = require('../utils/Layout');
var DataUtils = require('../utils/Data');

var SpeciesTreeStore = require('../stores/SpeciesTreeStore');

var DEFAULT = require('../defaults.js');

var Layout = React.createClass({

  propTypes: {

    // Tree

    projectTree: React.PropTypes.string.isRequired,
    analysisTree: React.PropTypes.string.isRequired,
    isolates: React.PropTypes.object.isRequired,
    selectIsolatesOnTree: React.PropTypes.array.isRequired,
    handleSelectTreeData: React.PropTypes.func.isRequired,
    treeNodeLabel: React.PropTypes.string,
    handleFilterMapAndTableData: React.PropTypes.func.isRequired,
    colourDataByDataField: React.PropTypes.string,

    // Map

    filteredMapData: React.PropTypes.object.isRequired,
    handleFilterTableData: React.PropTypes.func.isRequired,
    handleInfoWindowIsolateClick: React.PropTypes.func.isRequired,

    // Data

    metadata: React.PropTypes.object.isRequired,
    shortId: React.PropTypes.string.isRequired,
    filteredTableData: React.PropTypes.object.isRequired,
    handleColourDataByDataField: React.PropTypes.func.isRequired,
    handleChangeNodeLabel: React.PropTypes.func.isRequired,
    onTimelineFilterChange: React.PropTypes.func.isRequired,

    // Other

    settings: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      layoutWestWidth: 0,

      layoutWestMiddleDividerLeft: 0,

      layoutMiddleLeft: 0,
      layoutMiddleWidth: 0,

      layoutMiddleEastDividerLeft: 0,

      layoutEastLeft: 0,
      layoutEastWidth: 0,

      layoutNorthHeight: 0,

      layoutNorthSouthDividerTop: 0,

      layoutSouthTop: 0,
      layoutSouthHeight: 0,

      layoutNavigation: 'table'
    };
  },

  componentWillMount: function () {
    this.setLayout();
  },

  componentDidMount: function () {
    this.dangerouslyHandleWindowResize();
  },

  dangerouslyHandleWindowResize: function () {
    $(window).on('resize', this.setLayout);
  },

  setLayout: function () {
    this.setState({

      // West
      layoutWestWidth: LayoutUtils.getWestWidth(),

      layoutWestMiddleDividerLeft: LayoutUtils.getWestMiddleDividerLeft(),

      // Middle
      layoutMiddleLeft: LayoutUtils.getMiddleLeft(),
      layoutMiddleWidth: LayoutUtils.getMiddleWidth(),

      layoutMiddleEastDividerLeft: LayoutUtils.getMiddleEastDividerLeft(),

      // East
      layoutEastLeft: LayoutUtils.getEastLeft(),
      layoutEastWidth: LayoutUtils.getEastWidth(),

      // North
      layoutNorthHeight: LayoutUtils.getNorthHeight(),

      layoutNorthSouthDividerTop: LayoutUtils.getNorthSouthDividerTop(),

      // South
      layoutSouthTop: LayoutUtils.getSouthTop(),
      layoutSouthHeight: LayoutUtils.getSouthHeight()

    });
  },

  handleLayoutWestMiddleDividerSnapsToMiddleEastDivider: function (westMiddleDividerLeft) {
    var maximumWestMiddleDividerLeft = this.state.layoutMiddleEastDividerLeft - LayoutUtils.getDividerSize();
    var westMiddleDividerRight = westMiddleDividerLeft + LayoutUtils.getDividerSize();

    if (maximumWestMiddleDividerLeft - westMiddleDividerRight > 1 && maximumWestMiddleDividerLeft - westMiddleDividerRight < DEFAULT.LAYOUT.MINIMUM_CONTAINER_WIDTH) {
      this.handleLayoutWestMiddleDividerDragEnd(maximumWestMiddleDividerLeft);
    }
  },

  handleLayoutWestMiddleDividerSnapsToLayoutContainer: function (westMiddleDividerLeft) {

    var minimumWestMiddleDividerLeft = 0;

    if (westMiddleDividerLeft > 1 && westMiddleDividerLeft < DEFAULT.LAYOUT.MINIMUM_CONTAINER_WIDTH) {
      this.handleLayoutWestMiddleDividerDragEnd(minimumWestMiddleDividerLeft);
    }
  },

  handleLayoutWestMiddleDividerDragEnd: function (westMiddleDividerLeft) {

    this.setState({
      layoutWestWidth: westMiddleDividerLeft,
      layoutWestMiddleDividerLeft: westMiddleDividerLeft,
      layoutMiddleLeft: westMiddleDividerLeft + LayoutUtils.getDividerSize(),
      layoutMiddleWidth: this.state.layoutMiddleEastDividerLeft - westMiddleDividerLeft - LayoutUtils.getDividerSize()
    });

    this.handleLayoutWestMiddleDividerSnapsToMiddleEastDivider(westMiddleDividerLeft);
    this.handleLayoutWestMiddleDividerSnapsToLayoutContainer(westMiddleDividerLeft);
  },

  handleLayoutMiddleEastDividerSnapsToWestMiddleDivider: function (middleEastDividerLeft) {
    var minimumMiddleEastDividerLeft = this.state.layoutWestMiddleDividerLeft + LayoutUtils.getDividerSize();

    if (middleEastDividerLeft - minimumMiddleEastDividerLeft > 1 && middleEastDividerLeft - minimumMiddleEastDividerLeft < DEFAULT.LAYOUT.MINIMUM_CONTAINER_WIDTH) {
      this.handleLayoutMiddleEastDividerDragEnd(minimumMiddleEastDividerLeft);
    }
  },

  handleLayoutMiddleEastDividerSnapsToLayoutContainer: function (middleEastDividerLeft) {

    var maximumMiddleEastDividerLeft = LayoutUtils.getViewportWidth() - LayoutUtils.getDividerSize();

    if (maximumMiddleEastDividerLeft - middleEastDividerLeft > 1 && maximumMiddleEastDividerLeft - middleEastDividerLeft < DEFAULT.LAYOUT.MINIMUM_CONTAINER_WIDTH) {
      this.handleLayoutMiddleEastDividerDragEnd(maximumMiddleEastDividerLeft);
    }
  },

  handleLayoutMiddleEastDividerDragEnd: function (middleEastDividerLeft) {

    this.setState({
      layoutMiddleWidth: middleEastDividerLeft - this.state.layoutMiddleLeft,
      layoutMiddleEastDividerLeft: middleEastDividerLeft,
      layoutEastLeft: middleEastDividerLeft + LayoutUtils.getDividerSize(),
      layoutEastWidth: LayoutUtils.getViewportWidth() - (middleEastDividerLeft + LayoutUtils.getDividerSize())
    });

    this.handleLayoutMiddleEastDividerSnapsToWestMiddleDivider(middleEastDividerLeft);
    this.handleLayoutMiddleEastDividerSnapsToLayoutContainer(middleEastDividerLeft);
  },

  handleLayoutNorthSouthDividerSnapsToLayoutContainer: function (northSouthDividerTop) {

    var minimumNorthSouthDividerTop = 0;
    var maximumNorthSouthDividerTop = LayoutUtils.getViewportHeight() - LayoutUtils.getDividerSize();

    if (northSouthDividerTop > 1 && northSouthDividerTop < minimumNorthSouthDividerTop + DEFAULT.LAYOUT.MINIMUM_CONTAINER_HEIGHT) {
      this.handleLayoutNorthSourthDividerDragEnd(minimumNorthSouthDividerTop);
      return;
    }

    if (northSouthDividerTop < maximumNorthSouthDividerTop && northSouthDividerTop > maximumNorthSouthDividerTop - DEFAULT.LAYOUT.MINIMUM_CONTAINER_HEIGHT) {
      this.handleLayoutNorthSourthDividerDragEnd(maximumNorthSouthDividerTop);
    }

  },

  handleLayoutNorthSourthDividerDragEnd: function (northSouthDividerTop) {

    this.setState({
      layoutNorthHeight: northSouthDividerTop,
      layoutNorthSouthDividerTop: northSouthDividerTop,
      layoutSouthTop: northSouthDividerTop + LayoutUtils.getDividerSize(),
      layoutSouthHeight: LayoutUtils.getViewportHeight() - (northSouthDividerTop + LayoutUtils.getDividerSize())
    });

    this.handleLayoutNorthSouthDividerSnapsToLayoutContainer(northSouthDividerTop);

  },

  handleLayoutNavigationChange: function (layoutNavigation) {
    this.setState({
      layoutNavigation: layoutNavigation
    });
  },

  showTimeline: function () {
    var dataObjects = DataUtils.convertDataObjectToArray(this.props.isolates);
    return DataUtils.dataHasDateMetaFields(dataObjects);
  },

  render: function () {

    var speciesTree = {
      width: this.state.layoutEastWidth,
      height: this.state.layoutNorthHeight,
      tree: SpeciesTreeStore.getSpeciesTree(),
      isolates: this.props.isolates,
      selectIsolatesOnTree: this.props.selectIsolatesOnTree,
      handleSelectTreeData: this.props.handleSelectTreeData,
      nodeLabel: this.props.treeNodeLabel,
      handleFilterMapAndTableData: this.props.handleFilterMapAndTableData,
      colourDataByDataField: this.props.colourDataByDataField,
      treeId: 'speciesTree'
    };

    var analysisTree = {
      width: this.state.layoutMiddleWidth,
      height: this.state.layoutNorthHeight,
      tree: this.props.analysisTree,
      isolates: this.props.isolates,
      selectIsolatesOnTree: this.props.selectIsolatesOnTree,
      handleSelectTreeData: this.props.handleSelectTreeData,
      nodeLabel: this.props.treeNodeLabel,
      handleFilterMapAndTableData: this.props.handleFilterMapAndTableData,
      colourDataByDataField: this.props.colourDataByDataField,
      treeId: 'analysisTree'
    };

    var map = {
      width: this.state.layoutWestWidth,
      height: this.state.layoutNorthHeight,
      filteredMapData: this.props.filteredMapData,
      handleFilterTableData: this.props.handleFilterTableData,
      handleInfoWindowIsolateClick: this.props.handleInfoWindowIsolateClick,
      colourDataByDataField: this.props.colourDataByDataField
    };

    var data = {
      isolates: this.props.isolates,
      metadata:this.props.metadata,
      shortId: this.props.shortId,
      filteredTableData: this.props.filteredTableData,
      handleColourDataByDataField: this.props.handleColourDataByDataField,
      handleChangeNodeLabel: this.props.handleChangeNodeLabel,
      colourDataByDataField: this.props.colourDataByDataField,
      treeNodeLabel: this.props.treeNodeLabel,
      onTimelineFilterChange: this.props.onTimelineFilterChange
    };

    return (

      <LayoutContainer>

        <LayoutNorth height={this.state.layoutNorthHeight}>

          <LayoutWest width={this.state.layoutWestWidth}>

            <SpeciesTree
              width={this.state.layoutWestWidth}
              height={speciesTree.height}
              selectIsolates={speciesTree.selectIsolatesOnTree}
              handleSelectTreeData={speciesTree.handleSelectTreeData}
              nodeLabel={speciesTree.nodeLabel}
              handleFilterMapAndTableData={speciesTree.handleFilterMapAndTableData}
              colourDataByDataField={speciesTree.colourDataByDataField} />

          </LayoutWest>

          <LayoutWestMiddleDivider
            left={this.state.layoutWestMiddleDividerLeft}
            containmentRight={this.state.layoutMiddleEastDividerLeft}
            layoutMiddleEastDividerLeft={this.state.layoutMiddleEastDividerLeft}
            onDragEnd={this.handleLayoutWestMiddleDividerDragEnd} />

          <LayoutMiddle left={this.state.layoutMiddleLeft} width={this.state.layoutMiddleWidth}>

            <Tree
              width={this.state.layoutMiddleWidth}
              height={analysisTree.height}
              tree={analysisTree.tree}
              isolates={analysisTree.isolates}
              selectIsolates={analysisTree.selectIsolatesOnTree}
              handleSelectTreeData={analysisTree.handleSelectTreeData}
              nodeLabel={analysisTree.nodeLabel}
              handleFilterMapAndTableData={analysisTree.handleFilterMapAndTableData}
              colourDataByDataField={analysisTree.colourDataByDataField}
              treeId={analysisTree.treeId} />

          </LayoutMiddle>

          <LayoutMiddleEastDivider
            left={this.state.layoutMiddleEastDividerLeft}
            containmentLeft={this.state.layoutMiddleLeft}
            layoutWestMiddleDividerLeft={this.state.layoutWestMiddleDividerLeft}
            onDragEnd={this.handleLayoutMiddleEastDividerDragEnd} />

          <LayoutEast left={this.state.layoutEastLeft} width={this.state.layoutEastWidth}>

            <Map
              width={this.state.layoutEastWidth}
              height={map.height}
              filteredMapData={map.filteredMapData}
              handleFilterData={map.handleFilterTableData}
              handleInfoWindowIsolateClick={map.handleInfoWindowIsolateClick}
              colourDataByDataField={map.colourDataByDataField} />

          </LayoutEast>

        </LayoutNorth>

        <LayoutNorthSouthDivider
          top={this.state.layoutNorthSouthDividerTop}
          onDragEnd={this.handleLayoutNorthSourthDividerDragEnd} />

        <LayoutSouth top={this.state.layoutSouthTop}>
          {/*
          <Data
            isolates={this.state.isolates}
            metadata={this.state.metadata}
            shortId={this.state.shortId}
            updateLinkError={this.state.updateLinkError}
            filteredTableData={this.state.filteredTableData}
            handleColourDataByDataField={this.handleColourDataByDataField}
            handleChangeNodeLabel={this.handleChangeNodeLabel}
            colourDataByDataField={this.state.colourDataByDataField}
            setNodeLabelToDataField={this.state.treeNodeLabel} />
          */}
        </LayoutSouth>

      </LayoutContainer>
    );
  }
});

module.exports = Layout;
