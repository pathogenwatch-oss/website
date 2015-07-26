var React = require('react');
var TreeControls = require('./TreeControls.react');
var PhyloCanvas = require('PhyloCanvas');
var TimelineUtils = require('../utils/Timeline');
var DEFAULT = require('../defaults');

var SpeciesTreeStore = require('../stores/SpeciesTreeStore');
var SpeciesSubtreeStore = require('../stores/SpeciesSubtreeStore');
var SpeciesSubtreeActionCreators = require('../actions/SpeciesSubtreeActionCreators');
var PublicCollectionStore = require('../stores/PublicCollectionStore');
var UploadedCollectionStore = require('../stores/UploadedCollectionStore');

var DEFAULT_TREE_SETTINGS = {
  SHOW_TREE_LABELS: true,
  MINIMUM_NODE_SIZE: 1,
  MAXIMUM_NODE_SIZE: 200,
  MINIMUM_TEXT_SIZE: 1,
  MAXIMUM_TEXT_SIZE: 200
};

var TREE_SETTINGS = {
  TREE_TYPE: 'tt',
  NODE_SIZE: 'tns',
  TEXT_SIZE: 'tts',
  SHOW_TREE_LABELS: 'tl',
};

var TREE_TYPE_SETTING_OPTIONS = {
  rd: 'radial',
  rc: 'rectangular',
  cr: 'circular',
  dg: 'diagonal',
  hr: 'hierarchy'
};

var SHOW_TREE_LABELS_SETTING_OPTIONS = {
  0: false,
  1: true
};

var sectionStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
};

var phylocanvasStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
};

var treeControlsToggleButton = {
  position: 'absolute',
  bottom: 5,
  right: 5,
  zIndex: 999
};

var Tree = React.createClass({

  tree: null,
  treeId: null,
  phylocanvas: null,

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return ({
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      nodeSize: DEFAULT.NODE_SIZE,
      labelSize: DEFAULT.LABEL_SIZE
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
    var phylocanvas = new PhyloCanvas.Tree(this.treeId, {
      history: {
        collapsed: true
      }
    });
    phylocanvas.dangerouslySetData(this.tree);

    phylocanvas.showLabels = DEFAULT_TREE_SETTINGS.SHOW_TREE_LABELS;
    phylocanvas.hoverLabel = true;
    phylocanvas.nodeAlign = false;
    phylocanvas.setTreeType(this.state.treeType);
    phylocanvas.setNodeSize(this.state.nodeSize);
    phylocanvas.setTextSize(this.state.labelSize);

    window.phylocanvas = phylocanvas;
    this.phylocanvas = phylocanvas;

    this.phylocanvas.on('selected', this.handleTreeBranchSelected);
    this.phylocanvas.on('subtree', this.handleRedrawSubtree);
    this.phylocanvas.on('historytoggle', this.handleHistoryToggle);
  },

  setNodeShapeAndColour: function () {
    var branches = this.phylocanvas.branches;
    var branchIds = Object.keys(branches);

    this.phylocanvas.setNodeColourAndShape(branchIds, '#ffffff', 's');
  },

  emphasizeShapeAndColourForNodesThatHaveSubtrees: function () {
    var subtreeIds = SpeciesSubtreeStore.getSpeciesSubtreeIds();

    this.phylocanvas.setNodeColourAndShape(subtreeIds, '#000000', 's');
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
      treeType: treeType
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

      var subtreeId = selectedNodeIds[0];
      this.showUploadedCollectionSubtree(subtreeId);

    }
  },

  showUploadedCollectionTree: function () {
    SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(UploadedCollectionStore.getUploadedCollectionId());
  },

  showUploadedCollectionSubtree: function (subtreeId) {
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
      isTreeControlsOn: !this.state.isTreeControlsOn
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
        isTreeControlsOn: false
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
  }
});

module.exports = Tree;
