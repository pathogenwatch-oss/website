var React = require('react');
var PhyloCanvas = require('PhyloCanvas');
var TreeControls = require('./TreeControls.react');
var DEFAULT = require('../defaults');
var ANTIBIOTICS = require('../../static_data/antibiotics.json');

var SpeciesSubtreeStore = require('../stores/SpeciesSubtreeStore');
var PublicCollectionStore = require('../stores/PublicCollectionStore');
var UploadedCollectionStore = require('../stores/UploadedCollectionStore');
var TableStore = require('../stores/TableStore');
var MapActionCreators = require('../actions/MapActionCreators');
var TableActionCreators = require('../actions/TableActionCreators');
var SpeciesSubtreeActionCreators = require('../actions/SpeciesSubtreeActionCreators');

var DataUtils = require('../utils/Data');
var MetadataUtils = require('../utils/Metadata');

var assign = require('object-assign');

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
    treeId: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return ({
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      nodeSize: DEFAULT.NODE_SIZE,
      labelSize: DEFAULT.LABEL_SIZE,
      nodeLabel: TableStore.getSelectedTableColumnName()
    });
  },

  componentWillMount: function () {
    this.tree = SpeciesSubtreeStore.getActiveSpeciesSubtree();
    this.treeId = this.props.treeId;
  },

  componentDidMount: function () {
    this.renderTree();
    TableStore.addChangeListener(this.handleTableStoreChange);
  },

  componentWillUnmount: function () {
    TableStore.removeChangeListener(this.handleTableStoreChange);
  },

  handleTableStoreChange: function () {
    this.setState({
      nodeLabel: TableStore.getSelectedTableColumnName()
    });
  },

  renderTree: function () {
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

    this.setNodesLabel();
    this.setNodesShapeAndColour();
  },

  getNodeShapeForAssembly: function (assembly) {
    return 'square';
  },

  getNodeColourForAssembly: function (assembly) {
    var selectedTableColumnName = TableStore.getSelectedTableColumnName();
    var resistanceProfileResult;
    var colour = '#ffffff';

    if (this.selectedTableColumnNameIsAntibiotic()) {
      resistanceProfileResult = assembly.analysis.resistanceProfile[selectedTableColumnName].resistanceResult;

      if (resistanceProfileResult === 'RESISTANT') {
        colour = '#ff0000';
      } else {
        colour = '#ffffff';
      }

    } else if (this.isAssemblyInPublicCollection(assembly.metadata.assemblyId)) {

      colour = '#ffffff';

    } else if (this.isAssemblyInUploadedCollection(assembly.metadata.assemblyId)) {

      colour = '#000000';
    }

    return colour;
  },

  setNodesLabel: function () {
    var publicCollection = PublicCollectionStore.getPublicCollection();
    var assemblyIds = Object.keys(publicCollection.assemblies);
    var nodeLabel = this.state.nodeLabel;
    var nodeLabelValue;
    var branch;

    var publicCollectionAssemblies = PublicCollectionStore.getPublicCollectionAssemblies();
    var uploadedCollectionAssemblies = UploadedCollectionStore.getUploadedCollectionAssemblies();

    var combinedAssemblies = assign({}, publicCollectionAssemblies, uploadedCollectionAssemblies);
    var combinedAssemblyIds = Object.keys(combinedAssemblies);

    combinedAssemblyIds.forEach(function (assemblyId) {

      if (nodeLabel === 'Assembly Id') {
        nodeLabelValue = combinedAssemblies[assemblyId].metadata.fileAssemblyId || combinedAssemblies[assemblyId].metadata.userAssemblyId || '';
      } else if (nodeLabel === 'Country') {
        nodeLabelValue = MetadataUtils.getCountry(combinedAssemblies[assemblyId]);
      } else if (nodeLabel === 'Source') {
        nodeLabelValue = combinedAssemblies[assemblyId].metadata.source || '';
      } else if (nodeLabel === 'Date') {
        nodeLabelValue = DataUtils.getFormattedDateString(combinedAssemblies[assemblyId].metadata.date) || '';
      } else if (nodeLabel === 'ST') {
        nodeLabelValue = combinedAssemblies[assemblyId].analysis.st || '';
      } else {
        nodeLabelValue = nodeLabel + ': ' + combinedAssemblies[assemblyId].analysis.resistanceProfile[nodeLabel].resistanceResult || '';
      }

      branch = this.phylocanvas.branches[assemblyId];

      if (branch && branch.leaf) {
        branch.label = nodeLabelValue;
      }

    }.bind(this));

    this.phylocanvas.draw();
  },

  getCombinedPublicAndUploadedCollectionAssemblies: function () {
    var publicCollectionAssemblies = PublicCollectionStore.getPublicCollectionAssemblies();
    var uploadedCollectionAssemblies = UploadedCollectionStore.getUploadedCollectionAssemblies();
    return assign({}, publicCollectionAssemblies, uploadedCollectionAssemblies);
  },

  selectedTableColumnNameIsAntibiotic: function () {
    var selectedTableColumnName = TableStore.getSelectedTableColumnName();
    var listOfAntibiotics = Object.keys(ANTIBIOTICS);

    return (listOfAntibiotics.indexOf(selectedTableColumnName) > -1);
  },

  isAssemblyInPublicCollection: function (assemblyId) {
    var publicCollectionAssemblyIds = PublicCollectionStore.getPublicCollectionAssemblyIds();

    return (publicCollectionAssemblyIds.indexOf(assemblyId) > -1);
  },

  isAssemblyInUploadedCollection: function (assemblyId) {
    var uploadedCollectionAssemblyIds = UploadedCollectionStore.getUploadedCollectionAssemblyIds();

    return (uploadedCollectionAssemblyIds.indexOf(assemblyId) > -1);
  },

  setNodeShapeAndColour: function (assembly, shape, colour) {
    var branch = this.phylocanvas.branches[assembly.metadata.assemblyId];

    if (branch && branch.leaf) {
      branch.shape = shape;
      branch.colour = colour;
    }
  },

  setNodesShapeAndColour: function () {
    var combinedAssemblies = this.getCombinedPublicAndUploadedCollectionAssemblies();
    var combinedAssemblyIds = Object.keys(combinedAssemblies);
    var assembly;
    var shape;
    var colour;

    combinedAssemblyIds.forEach(function (assemblyId) {

      assembly = combinedAssemblies[assemblyId];

      if (! assembly) {
        return;
      }

      shape = this.getNodeShapeForAssembly(assembly);
      colour = this.getNodeColourForAssembly(assembly);

      this.setNodeShapeAndColour(assembly, shape, colour);
    }.bind(this));
  },

  // setDefaultNodeShapeAndColour: function () {
  //   var branches = this.phylocanvas.branches;
  //   var branchIds = Object.keys(branches);
  //
  //   this.phylocanvas.setNodeColourAndShape(branchIds, '#ffffff', 'o');
  // },

  // setResistanceProfileNodeShapeAndColour: function () {
  //   var selectedTableColumnName = TableStore.getSelectedTableColumnName();
  //   var listOfAntibiotics = Object.keys(ANTIBIOTICS);
  //
  //   if (listOfAntibiotics.indexOf(selectedTableColumnName) > -1) {
  //
  //     var publicCollectionAssemblies = PublicCollectionStore.getPublicCollectionAssemblies();
  //     var uploadedCollectionAssemblies = UploadedCollectionStore.getUploadedCollectionAssemblies();
  //
  //     var combinedAssemblies = assign({}, publicCollectionAssemblies, uploadedCollectionAssemblies);
  //     var combinedAssemblyIds = Object.keys(combinedAssemblies);
  //
  //     var branch;
  //     var assembly;
  //     var resistanceProfileResult;
  //     var resistanceProfileColour;
  //
  //     combinedAssemblyIds.forEach(function (assemblyId) {
  //       branch = this.phylocanvas.branches[assemblyId];
  //
  //       if (branch && branch.leaf) {
  //
  //         assembly = combinedAssemblies[assemblyId];
  //         resistanceProfileResult = assembly.analysis.resistanceProfile[selectedTableColumnName].resistanceResult;
  //
  //         if (resistanceProfileResult === 'RESISTANT') {
  //           resistanceProfileColour = '#ff0000';
  //         } else {
  //           resistanceProfileColour = '#ffffff';
  //         }
  //
  //         branch.colour = resistanceProfileColour;
  //       }
  //
  //     }.bind(this));
  //   }
  // },
  //
  // emphasizeShapeAndColourForNodesThatHaveSubtrees: function () {
  //
  //   var uploadedCollectionAssemblyIds = UploadedCollectionStore.getUploadedCollectionAssemblyIds();
  //
  //   this.phylocanvas.setNodeColourAndShape(uploadedCollectionAssemblyIds, '#000000', 'o');
  // },

  handleRedrawSubtree: function () {
    var isolateIds = this.getCurrentTreeAllIsolateIds();
    this.props.handleFilterMapAndTableData(isolateIds);
  },

  componentDidUpdate: function () {
    this.setNodesLabel();
    this.phylocanvas.resizeToContainer();
    this.setNodesShapeAndColour();
    this.phylocanvas.draw();
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

    /**
     * Unfortunately selectedNodeIds can return string
     * if only one node has been selected.
     *
     * In that case convert it to array.
     */
    if (typeof selectedNodeIds === 'string') {
      selectedNodeIds = [ selectedNodeIds ];
    }

    if (selectedNodeIds.length === 0) {
      SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(SpeciesSubtreeStore.getActiveSpeciesSubtreeId());
    } else {
      MapActionCreators.setAssemblyIds(selectedNodeIds);
      TableActionCreators.setAssemblyIds(selectedNodeIds);
    }
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
