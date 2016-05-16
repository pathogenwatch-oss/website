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

const initialMaxScale = 2;
const maxBaseSize = 10;
const minBaseSize = 3;

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
    return {
      isHighlightingBranch: false,
      isTreeControlsOn: false,
      treeType: DEFAULT.TREE_TYPE,
      scales: {
        node: 1,
        label: 1,
        max: initialMaxScale,
      },
    };
  },

  componentDidMount() {
    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container', {
      contextMenu: {
        parent: document.body,
      },
      fillCanvas: true,
    });

    phylocanvas.padding = 64;
    phylocanvas.showLabels = true;
    phylocanvas.hoverLabel = true;
    phylocanvas.branchColour = DEFAULT.COLOUR;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.clickFlag = 'highlighted';
    phylocanvas.clickFlagPredicate = node => node.leaf;

    phylocanvas.setTreeType(this.state.treeType);

    phylocanvas.on('loaded', () => {
      this.props.styleTree(phylocanvas);
      this.setBaseSize(phylocanvas);
    });

    phylocanvas.on('subtree', () => {
      this.props.setUnfilteredIds(phylocanvas.leaves.map(_ => _.id));
      this.setBaseSize(phylocanvas);
    });

    phylocanvas.on('loaded', this.onLoaded);
    phylocanvas.on('updated', this.onUpdated);

    this.phylocanvas = phylocanvas;

    this.loadTree();
  },

  componentDidUpdate(previous) {
    this.phylocanvas.resizeToContainer();

    const { filenames, newick } = this.props;

    if (filenames !== previous.filenames) {
      this.phylocanvas.contextMenu.filenames = filenames;
    }

    if (newick && newick !== this.phylocanvas.stringRepresentation) {
      this.loadTree();
    } else {
      this.props.styleTree(this.phylocanvas);
      this.phylocanvas.draw();
    }
  },

  onLoaded() {
    this.props.onLoaded(this.phylocanvas);
  },

  onUpdated(event) {
    this.props.onUpdated(event, this.phylocanvas);
  },

  render() {
    const { header, loading } = this.props;

    return (
      <section className="wgsa-tree">
        {header}
        <div id="phylocanvas-container" style={fullWidthHeight}></div>
        <button
          style={{ position: 'absolute', top: 24, right: 16, zIndex: 1, color: '#673C90' }}
          className="mdl-button mdl-js-button mdl-button--icon"
          onClick={this.openContextMenu}
        >
          <i className="material-icons">settings</i>
        </button>
        <TreeControls
          treeType={this.state.treeType}
          scales={this.state.scales}
          handleTreeTypeChange={this.handleTreeTypeChange}
          handleNodeScaleChange={this.handleNodeScaleChange}
          handleLabelScaleChange={this.handleLabelScaleChange}
        />
        { loading ?
          <div className="wgsa-loading-overlay">
            <Spinner />
          </div> : null }
      </section>
    );
  },

  phylocanvas: null,

  setBaseSize(tree) {
    this.baseSize = Math.min(
      maxBaseSize,
      Math.max(minBaseSize, tree.prerenderer.getStep(tree) / 2)
    );

    tree.baseNodeSize = this.baseSize;
    tree.textSize = this.baseSize;

    tree.fitInPanel();
    tree.draw();

    this.setState({
      scales: {
        node: 1,
        label: 1,
        max: Math.max(
          initialMaxScale,
          (initialMaxScale * maxBaseSize) / this.baseSize
        ),
      },
    });
  },

  loadTree() {
    this.phylocanvas.load(this.props.newick);
  },

  handleNodeScaleChange(event) {
    this.phylocanvas.baseNodeSize = this.baseSize * parseFloat(event.target.value);
    this.phylocanvas.draw();
  },

  handleLabelScaleChange(event) {
    this.phylocanvas.textSize = this.baseSize * parseFloat(event.target.value);
    this.phylocanvas.draw();
  },

  handleTreeTypeChange(event) {
    this.phylocanvas.setTreeType(event.target.value);
  },

  openContextMenu(event) {
    event.preventDefault();
    console.log(event.target);
    this.phylocanvas.contextMenu.open(event.clientX, event.clientY);
    this.phylocanvas.contextMenu.closed = false;
    this.phylocanvas.tooltip.close();
  },

});
