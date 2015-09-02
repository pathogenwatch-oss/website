import '../css/tree.css';

import React from 'react';
import TreeControls from './TreeControls.react';
import PhyloCanvas from 'PhyloCanvas';

import DEFAULT, { CGPS } from '../defaults';

import SpeciesTreeStore from '../stores/SpeciesTreeStore';
import SpeciesSubtreeStore from '../stores/SpeciesSubtreeStore';
import UploadedCollectionStore from '../stores/UploadedCollectionStore';
import SpeciesSubtreeActionCreators from '../actions/SpeciesSubtreeActionCreators';

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
  width: `calc(100% - ${sectionHeaderHeight}px)`,
  height: `calc(100% - ${sectionFooterHeight}px)`,
  margin: '0 auto',
};

const Tree = React.createClass({

  tree: null,
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
    this.collectionId = UploadedCollectionStore.getUploadedCollectionId();
  },

  componentDidMount: function () {
    componentHandler.upgradeElement(React.findDOMNode(this.refs.menu_button));
    componentHandler.upgradeElement(React.findDOMNode(this.refs.menu));

    this.initializeTree();
    this.setNodeShapeAndColour();
    this.emphasizeShapeAndColourForNodesThatHaveSubtrees();

    this.phylocanvas.draw();
  },

  componentDidUpdate: function () {
    const subtree = SpeciesSubtreeStore.getActiveSpeciesSubtree();
    const tree = subtree ? subtree.newick : SpeciesTreeStore.getSpeciesTree();

    if (tree !== this.tree) {
      this.phylocanvas.load(tree);
      this.setNodeShapeAndColour();
      this.emphasizeShapeAndColourForNodesThatHaveSubtrees();
      this.tree = tree;
    }

    this.phylocanvas.resizeToContainer();
    this.phylocanvas.fitInPanel();
    this.phylocanvas.draw();
  },

  initializeTree: function () {
    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container');
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
    const branchIds = Object.keys(this.phylocanvas.branches);
    this.phylocanvas.setNodeDisplay(branchIds, { colour: '#ffffff' });
  },

  emphasizeShapeAndColourForNodesThatHaveSubtrees: function () {
    const subtrees = SpeciesSubtreeStore.getSpeciesSubtrees();
    const subtreeIds = Object.keys(subtrees);

    this.phylocanvas.setNodeDisplay(subtreeIds, { colour: CGPS.COLOURS.PURPLE_LIGHT });

    subtreeIds.forEach((id) => {
      const branch = this.phylocanvas.branches[id];
      if (branch) {
        branch.label = `${branch.label} (${subtrees[id].assemblyIds.length})`;
      }
    });
  },

  handleRedrawSubtree: function () {
    this.props.handleFilterMapAndTableData(this.getCurrentTreeAllIsolateIds());
  },

  setNodeLabel: function (nodeLabel) {
    Object.keys(this.props.isolates).forEach((isolateId) => {
      const isolate = this.props.isolates[isolateId];

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
    this.setTextSize(this.phylocanvas.textSize + amount);
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
    this.setNodeSize(this.phylocanvas.baseNodeSize + amount);
  },

  incrementNodeSize: function () {
    this.changeNodeSizeByAmount(1);
  },

  decrementNodeSize: function () {
    this.changeNodeSizeByAmount(-1);
  },

  handleTreeBranchSelected: function ({ nodeIds }) {
    if (nodeIds.length === 1) {
      this.setActiveSubtree(nodeIds[0]);
    }
  },

  setActiveSubtree: function (key) {
    SpeciesSubtreeActionCreators.setActiveSpeciesSubtreeId(key);
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
        <header className="wgsa-tree-header">
          {this.getNavButton(this.props.title)}
          <h2 className="wgsa-tree-heading">{this.props.title}</h2>
          <div className="wgsa-tree-menu">
            <button ref="menu_button" id="tree-options" className="wgsa-tree-actions mdl-button mdl-js-button mdl-button--icon">
              <i className="material-icons">more_vert</i>
            </button>
            <ul ref="menu" className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="tree-options">
              <li className="mdl-menu__item" onClick={this.handleToggleNodeLabels}>Toggle Labels</li>
              <li className="mdl-menu__item" onClick={this.handleToggleNodeAlign}>Toggle Label Align</li>
              <li className="mdl-menu__item" onClick={this.handleRedrawOriginalTree}>Redraw Original Tree</li>
              <li className="mdl-menu__item" onClick={this.handleExportCurrentView}>Export Current View</li>
            </ul>
          </div>
        </header>
        <div id="phylocanvas-container" style={phylocanvasStyle}></div>
        <TreeControls
          treeType={this.state.treeType}
          nodeSize={this.state.nodeSize}
          labelSize={this.state.labelSize}
          handleTreeTypeChange={this.handleTreeTypeChange}
          handleNodeSizeChange={this.handleNodeSizeChange}
          handleLabelSizeChange={this.handleLabelSizeChange} />
      </section>
    );
  },

  getNavButton(title) {
    if (title === 'Population') {
      return (
        <button title="View collection tree" className="wgsa-tree-return mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={this.setActiveSubtree.bind(null, this.collectionId)}>
          <i className="material-icons">nature</i>
        </button>
      );
    }

    if (title === 'Collection') {
      return (
        <button title="View population tree" className="wgsa-tree-return mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={this.setActiveSubtree.bind(null, null)}>
          <i className="material-icons">nature_people</i>
        </button>
      );
    }

    return (
      <button title="Return to population tree" className="wgsa-tree-return mdl-button mdl-js-button mdl-button--icon" onClick={this.setActiveSubtree.bind(null, null)}>
        <i className="material-icons">arrow_back</i>
      </button>
    );
  },

});

module.exports = Tree;
