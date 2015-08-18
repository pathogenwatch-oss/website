import '../css/tree.css';

import React from 'react';
import TreeControls from './TreeControls.react';
import PhyloCanvas from 'PhyloCanvas';

import DEFAULT, { CGPS } from '../defaults';

import SpeciesTreeStore from '../stores/SpeciesTreeStore';
import SpeciesSubtreeStore from '../stores/SpeciesSubtreeStore';
import SpeciesSubtreeActionCreators from '../actions/SpeciesSubtreeActionCreators';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';

const DEFAULT_TREE_SETTINGS = {
  SHOW_TREE_LABELS: true,
  MINIMUM_NODE_SIZE: 1,
  MAXIMUM_NODE_SIZE: 200,
  MINIMUM_TEXT_SIZE: 1,
  MAXIMUM_TEXT_SIZE: 200,
};

const sectionHeaderHeight = 64;
const sectionFooterHeight = 80;

const sectionStyle = {
  position: 'relative',
  width: '100%',
  height: `calc(100% - ${sectionHeaderHeight}px)`,
  paddingTop: `${sectionHeaderHeight}px`,
};

const phylocanvasStyle = {
  position: 'relative',
  width: '100%',
  height: `calc(100% - ${sectionFooterHeight}px)`,
};

const menuWrapperStyle = {
  position: 'absolute',
  right: '8px',
};

const Tree = React.createClass({

  tree: null,
  treeId: null,
  phylocanvas: null,

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },

  getInitialState: function () {
    return ({
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      nodeSize: DEFAULT.NODE_SIZE,
      labelSize: DEFAULT.LABEL_SIZE,
    });
  },

  componentWillMount: function () {
    this.tree = SpeciesTreeStore.getSpeciesTree();
    this.treeId = 'species-tree';
  },

  componentDidMount: function () {
    this.initializeTree();
    this.setNodeShapeAndColour();
    this.emphasizeShapeAndColourForNodesThatHaveSubtrees();
    componentHandler.upgradeDom();
  },

  initializeTree: function () {
    const phylocanvas = PhyloCanvas.createTree(this.treeId, {
      history: {
        collapsed: true,
      },
    });
    phylocanvas.load(this.tree);

    phylocanvas.showLabels = DEFAULT_TREE_SETTINGS.SHOW_TREE_LABELS;
    phylocanvas.hoverLabel = true;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.setTreeType(this.state.treeType);
    phylocanvas.setNodeSize(this.state.nodeSize);
    phylocanvas.setTextSize(this.state.labelSize);

    this.phylocanvas = phylocanvas;
    this.phylocanvas.on('updated', this.handleTreeBranchSelected);
    this.phylocanvas.on('subtree', this.handleRedrawSubtree);
    this.phylocanvas.on('historytoggle', this.handleHistoryToggle);
  },

  setNodeShapeAndColour: function () {
    var branches = this.phylocanvas.branches;
    var branchIds = Object.keys(branches);

    this.phylocanvas.setNodeDisplay(branchIds, { colour: '#ffffff' });
  },

  emphasizeShapeAndColourForNodesThatHaveSubtrees: function () {
    var subtreeIds = SpeciesSubtreeStore.getSpeciesSubtreeIds();
    this.phylocanvas.setNodeDisplay(subtreeIds, { colour: CGPS.COLOURS.PURPLE_LIGHT });
  },

  handleRedrawSubtree: function () {
    var isolateIds = this.getCurrentTreeAllIsolateIds();
    this.props.handleFilterMapAndTableData(isolateIds);
  },

  componentDidUpdate: function () {
    this.phylocanvas.resizeToContainer();
    this.phylocanvas.fitInPanel();
    this.phylocanvas.draw();
  },

  setNodeLabel: function (nodeLabel) {
    var isolates = this.props.isolates;
    var isolateIds = Object.keys(isolates);
    var isolate;

    isolateIds.forEach((isolateId) => {
      isolate = isolates[isolateId];

      if (this.phylocanvas.branches[isolateId] && this.phylocanvas.branches[isolateId].leaf) {
        this.phylocanvas.branches[isolateId].label = isolate[nodeLabel] || '';
      }
    });
  },

  redrawOriginalTree: function () {
    this.phylocanvas.redrawOriginalTree();
    this.setNodeShapeAndColour();
    this.emphasizeShapeAndColourForNodesThatHaveSubtrees();
  },

  toggleTreeLabels: function () {
    this.phylocanvas.toggleLabels();
  },

  setTreeType: function (treeType) {
    this.phylocanvas.setTreeType(treeType);
    this.setState({
      treeType: treeType,
    });
  },

  // http://stackoverflow.com/questions/3077242/force-download-a-pdf-link-using-javascript-ajax-jquery#answer-29266135
  exportCurrentTreeView: function () {
    var dataUrl = this.phylocanvas.getPngUrl();
    var anchor = document.createElement('a');
    var isDownloadSupported = (typeof anchor.download !== 'undefined');
    var event;

    anchor.href = dataUrl;
    anchor.target = '_blank';

    if (isDownloadSupported) {
      anchor.download = 'wgsa-saureus.png';
    }

    event = document.createEvent('Event');
    event.initEvent('click', true, true);
    anchor.dispatchEvent(event);

    if (isDownloadSupported) {
      (window.URL || window.webkitURL).revokeObjectURL(anchor.href);
    }
  },

  setLabelSize: function (labelSize) {
    this.phylocanvas.setTextSize(labelSize);
  },

  changeTextSizeByAmount: function (amount) {
    var currentSize = this.phylocanvas.textSize;
    this.setTextSize(currentSize + amount);
  },

  incrementLabelSize: function () {
    this.changeTextSizeByAmount(1);
  },

  decrementLabelSize: function () {
    this.changeTextSizeByAmount(-1);
  },

  setNodeSize: function (nodeSize) {
    this.phylocanvas.setNodeSize(nodeSize);
  },

  changeNodeSizeByAmount: function (amount) {
    var currentSize = this.phylocanvas.baseNodeSize;
    this.setNodeSize(currentSize + amount);
  },

  incrementNodeSize: function () {
    this.changeNodeSizeByAmount(1);
  },

  decrementNodeSize: function () {
    this.changeNodeSizeByAmount(-1);
  },

  handleTreeBranchSelected: function (event) {
    var selectedNodeIds = event.nodeIds;

    if (selectedNodeIds.length === 0) {
      this.showUploadedCollectionTree();
    } else if (selectedNodeIds.length === 1) {
      this.showUploadedCollectionSubtree(selectedNodeIds[0]);
    }
  },

  showUploadedCollectionTree: function () {
    SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(UploadedCollectionStore.getUploadedCollectionId());
  },

  showUploadedCollectionSubtree: function (subtreeId) {
    console.log(subtreeId);
    SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(subtreeId);
  },

  getCurrentTreeAllIsolateIds: function () {
    return this.phylocanvas.leaves.map(function (leaf) {
      return leaf.id;
    });
  },

  handleToggleNodeLabels: function () {
    this.toggleTreeLabels();
  },

  handleExportCurrentView: function () {
    this.exportCurrentTreeView();
  },

  handleRedrawOriginalTree: function () {
    this.redrawOriginalTree();
  },

  handleTreeTypeChange: function (treeType) {
    this.setTreeType(treeType);
  },

  handleNodeSizeChange: function (nodeSize) {
    this.setNodeSize(nodeSize);
  },

  handleLabelSizeChange: function (labelSize) {
    this.setLabelSize(labelSize);
  },

  handleToggleTreeControls: function () {
    this.setState({
      isTreeControlsOn: !this.state.isTreeControlsOn,
    });
  },

  handleToggleNodeAlign: function () {
    this.toggleNodeAlign();
  },

  toggleNodeAlign: function () {
    this.phylocanvas.alignLabels = !this.phylocanvas.alignLabels;
    this.phylocanvas.draw();
  },

  handleHistoryToggle: function (event) {
    if (event.isOpen) {
      this.setState({
        isTreeControlsOn: false,
      });
    }
  },

  render: function () {
    return (
      <section style={sectionStyle}>
        <div className="wgsa-tree-header">
          <h2 className="wgsa-tree-heading">General Population</h2>
          <div style={menuWrapperStyle}>
            <button id="tree-options" className="wgsa-tree-actions mdl-button mdl-js-button mdl-button--icon">
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="tree-options">
              <li className="mdl-menu__item" onClick={this.handleToggleNodeLabels}>Toggle Labels</li>
              <li className="mdl-menu__item" onClick={this.handleToggleNodeAlign}>Toggle Label Align</li>
              <li className="mdl-menu__item" onClick={this.handleRedrawOriginalTree}>Redraw Original Tree</li>
              <li className="mdl-menu__item" onClick={this.handleExportCurrentView}>Export Current View</li>
            </ul>
          </div>
        </div>
        <div id={this.treeId} style={phylocanvasStyle}></div>
        <TreeControls
          treeType={this.state.treeType}
          nodeSize={this.state.nodeSize}
          labelSize={this.state.labelSize}
          handleToggleNodeLabels={this.handleToggleNodeLabels}
          handleExportCurrentView={this.handleExportCurrentView}
          handleRedrawOriginalTree={this.handleRedrawOriginalTree}
          handleTreeTypeChange={this.handleTreeTypeChange}
          handleNodeSizeChange={this.handleNodeSizeChange}
          handleLabelSizeChange={this.handleLabelSizeChange}
          handleToggleNodeAlign={this.handleToggleNodeAlign} />
      </section>
    );
  },

});

module.exports = Tree;
