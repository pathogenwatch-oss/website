import '../../css/tree.css';

import React from 'react';
import PhyloCanvas from 'PhyloCanvas';
import contextMenuPlugin from 'phylocanvas-plugin-context-menu';

import TreeControls from './TreeControls.react';
// import TreeMenu from './TreeMenu.react';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';

import DEFAULT, { CGPS } from '^/defaults';

PhyloCanvas.plugin(contextMenuPlugin);

const fullWidthHeight = {
  height: '100%',
  width: '100%',
};

export default React.createClass({

  displayName: 'Tree',

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    newick: React.PropTypes.string,
    title: React.PropTypes.string,
    navButton: React.PropTypes.element,
    styleTree: React.PropTypes.func,
    onUpdated: React.PropTypes.func,
    onRedrawOriginalTree: React.PropTypes.func,
    highlightFilteredNodes: React.PropTypes.func,
    collections: React.PropTypes.object,
  },

  getInitialState() {
    return ({
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      nodeSize: DEFAULT.NODE_SIZE,
      labelSize: DEFAULT.LABEL_SIZE,
      treeLoaded: false,
    });
  },

  componentDidMount() {
    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container', {
      contextMenu: {
        parent: document.body,
      },
    });

    phylocanvas.padding = 128;
    phylocanvas.showLabels = true;
    phylocanvas.hoverLabel = true;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.setTreeType(this.state.treeType);

    phylocanvas.on('subtree', () => {
      FilteredDataActionCreators.setBaseAssemblyIds(
        this.phylocanvas.leaves.map(_ => _.id)
      );
    });

    phylocanvas.on('original-tree', () => {
      this.styleTree(this.phylocanvas);
      this.phylocanvas.fitInPanel();
      this.phylocanvas.draw();

      this.props.onRedrawOriginalTree();
    });

    this.phylocanvas = phylocanvas;

    this.loadTree();
  },

  componentWillUpdate() {
    this.phylocanvas.containerElement.removeEventListener('updated', this.props.onUpdated);
  },

  componentDidUpdate() {
    this.phylocanvas.resizeToContainer();

    this.phylocanvas.on('updated', this.props.onUpdated);

    if (this.props.newick && this.props.newick !== this.phylocanvas.stringRepresentation) {
      this.loadTree();
    } else {
      this.styleTree(this.phylocanvas);
      this.phylocanvas.draw();
    }
  },

  render() {
    const { title, navButton } = this.props;

    return (
      <section className="wgsa-tree">
        <header className="wgsa-tree-header">
          { navButton }
          <h2 className="wgsa-tree-heading">
            <span>{title}</span>
          </h2>
        </header>
        <div id="phylocanvas-container" style={fullWidthHeight}></div>
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

  phylocanvas: null,

  loadTree() {
    this.phylocanvas.load(this.props.newick, () => {
      this.props.styleTree(this.phylocanvas);
      this.phylocanvas.fitInPanel();
      this.phylocanvas.draw();
      this.setState({
        treeLoaded: true,
      });
    });
  },

  styleTree(tree) {
    tree.baseNodeSize = this.state.nodeSize;
    tree.textSize = this.state.labelSize;

    this.props.styleTree(tree);
  },

  handleNodeSizeChange(event) {
    this.setState({
      nodeSize: event.target.value,
    });
  },

  handleLabelSizeChange(event) {
    this.setState({
      labelSize: event.target.value,
    });
  },

  handleTreeTypeChange(event) {
    this.phylocanvas.setTreeType(event.target.value);
  },

});
