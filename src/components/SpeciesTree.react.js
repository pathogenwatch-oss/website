import React from 'react';
import TreeControls from './TreeControls.react';
import PhyloCanvas from 'PhyloCanvas';

import DEFAULT from '../defaults';

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

const sectionStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const phylocanvasStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const treeControlsToggleButton = {
  position: 'absolute',
  bottom: 5,
  right: 5,
  zIndex: 999,
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
    phylocanvas.nodeAlign = false;
    phylocanvas.setTreeType(this.state.treeType);
    phylocanvas.setNodeSize(this.state.nodeSize);
    phylocanvas.setTextSize(this.state.labelSize);

    this.phylocanvas = phylocanvas;
    console.log(this.phylocanvas);
    this.phylocanvas.on('updated', this.handleTreeBranchSelected);
    this.phylocanvas.on('subtree', this.handleRedrawSubtree);
    this.phylocanvas.on('historytoggle', this.handleHistoryToggle);
  },

  setNodeShapeAndColour: function () {
    var branches = this.phylocanvas.branches;
    var branchIds = Object.keys(branches);

    this.phylocanvas.setNodeDisplay(branchIds, { colour: '#ffffff', shape: 's' });
  },

  emphasizeShapeAndColourForNodesThatHaveSubtrees: function () {
    var subtreeIds = SpeciesSubtreeStore.getSpeciesSubtreeIds();

    this.phylocanvas.setNodeDisplay(subtreeIds, { colour: '#000000', shape: 's' });
  },

  handleRedrawSubtree: function () {
    var isolateIds = this.getCurrentTreeAllIsolateIds();
    this.props.handleFilterMapAndTableData(isolateIds);
  },

  componentDidUpdate: function () {
    this.phylocanvas.resizeToContainer();
    this.phylocanvas.draw();
  },

  setNodeLabel: function (nodeLabel) {
    var isolates = this.props.isolates;
    var isolateIds = Object.keys(isolates);
    var isolate;

    isolateIds.forEach(function (isolateId) {
      isolate = isolates[isolateId];

      if (this.phylocanvas.branches[isolateId] && this.phylocanvas.branches[isolateId].leaf) {
        this.phylocanvas.branches[isolateId].label = isolate[nodeLabel] || '';
      }
    }.bind(this));
  },

  redrawOriginalTree: function () {
    this.phylocanvas.redrawOriginalTree();
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
      anchor.download = 'microreact.png';
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
    //this.phylocanvas.history.collapse();
    this.setState({
      isTreeControlsOn: !this.state.isTreeControlsOn,
    });
  },

  handleToggleNodeAlign: function () {
    this.toggleNodeAlign();
  },

  toggleNodeAlign: function () {
    this.phylocanvas.nodeAlign = !this.phylocanvas.nodeAlign;
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
        <div id={this.treeId} style={phylocanvasStyle}></div>

        {this.state.isTreeControlsOn
          ?
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
          : null}

        <button className="btn btn-default btn-sm" style={treeControlsToggleButton} onClick={this.handleToggleTreeControls}>{this.state.isTreeControlsOn ? 'Hide controls' : 'Show controls'}</button>
      </section>
    );
  },

});

module.exports = Tree;
