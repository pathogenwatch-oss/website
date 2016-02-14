import '^/css/tree.css';
import '^/css/loading.css';

import React from 'react';
import PhyloCanvas from 'phylocanvas';
import contextMenuPlugin from 'phylocanvas-plugin-context-menu';

import TreeControls from './TreeControls.react';
import Spinner from '^/components/Spinner.react';

import DEFAULT, { CGPS } from '^/defaults';

PhyloCanvas.plugin(contextMenuPlugin);

const fullWidthHeight = {
  height: '100%',
  width: '100%',
};

export default React.createClass({

  displayName: 'Tree',

  propTypes: {
    newick: React.PropTypes.string,
    header: React.PropTypes.any,
    styleTree: React.PropTypes.func,
    onLoaded: React.PropTypes.func,
    onUpdated: React.PropTypes.func,
    loading: React.PropTypes.bool,
    filenames: React.PropTypes.object,
    setUnfilteredIds: React.PropTypes.func,
  },

  getInitialState() {
    return ({
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      nodeSize: DEFAULT.NODE_SIZE,
      labelSize: DEFAULT.LABEL_SIZE,
    });
  },

  componentDidMount() {
    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container', {
      contextMenu: {
        parent: document.body,
      },
      fillCanvas: true,
    });

    phylocanvas.baseNodeSize = this.state.nodeSize;
    phylocanvas.textSize = this.state.labelSize;
    phylocanvas.padding = 64;
    phylocanvas.showLabels = true;
    phylocanvas.hoverLabel = true;
    phylocanvas.branchColour = DEFAULT.COLOUR;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.setTreeType(this.state.treeType);

    phylocanvas.on('loaded', () => {
      this.styleTree(phylocanvas);
      phylocanvas.fitInPanel();
      phylocanvas.draw();
    });

    phylocanvas.on('subtree', () => {
      this.props.setUnfilteredIds(this.phylocanvas.leaves.map(_ => _.id));
    });

    phylocanvas.on('original-tree', () => {
      this.props.setUnfilteredIds(this.phylocanvas.leaves.map(_ => _.id));
    });

    this.onLoaded = () => this.props.onLoaded(phylocanvas);
    phylocanvas.on('loaded', this.onLoaded);
    phylocanvas.on('updated', this.props.onUpdated);

    this.phylocanvas = phylocanvas;

    this.loadTree();
  },

  componentWillUpdate() {
    const { containerElement } = this.phylocanvas;
    containerElement.removeEventListener('updated', this.props.onUpdated);
    containerElement.removeEventListener('loaded', this.onLoaded);
  },

  componentDidUpdate(previous) {
    this.phylocanvas.resizeToContainer();

    const { onLoaded, onUpdated, filenames, newick } = this.props;

    this.onLoaded = () => onLoaded(this.phylocanvas);
    this.phylocanvas.on('loaded', this.onLoaded);
    this.phylocanvas.on('updated', onUpdated);

    if (filenames !== previous.filenames) {
      this.phylocanvas.contextMenu.filenames = filenames;
    }

    if (newick && newick !== this.phylocanvas.stringRepresentation) {
      this.loadTree();
    } else {
      this.styleTree(this.phylocanvas);
      this.phylocanvas.draw();
    }
  },

  render() {
    const { header, loading } = this.props;

    return (
      <section className="wgsa-tree">
        {header}
        <div id="phylocanvas-container" style={fullWidthHeight}></div>
        <TreeControls
          treeType={this.state.treeType}
          nodeSize={this.state.nodeSize}
          labelSize={this.state.labelSize}
          handleTreeTypeChange={this.handleTreeTypeChange}
          handleNodeSizeChange={this.handleNodeSizeChange}
          handleLabelSizeChange={this.handleLabelSizeChange}
        />
        { loading ?
          <div className="wgsa-loading-overlay">
            <Spinner />
          </div> : null }
      </section>
    );
  },

  phylocanvas: null,

  loadTree() {
    this.phylocanvas.load(this.props.newick);
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
