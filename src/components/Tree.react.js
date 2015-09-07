import '../css/tree.css';

import React from 'react';
import PhyloCanvas from 'PhyloCanvas';

import TreeControls from './TreeControls.react';

import DEFAULT, { CGPS } from '../defaults';

const fullWidthHeight = {
  height: '100%',
  width: '100%',
};

export default React.createClass({

  propTypes: {
    newick: true,
    title: true,
    navButton: true,
    styleTree: true,
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
    componentHandler.upgradeElement(React.findDOMNode(this.refs.menu));

    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container');

    phylocanvas.padding = 128;
    phylocanvas.showLabels = true;
    phylocanvas.hoverLabel = true;
    phylocanvas.highlightColour = phylocanvas.selectedColour = CGPS.COLOURS.PURPLE;

    phylocanvas.setTreeType(this.state.treeType);
    phylocanvas.setNodeSize(this.state.nodeSize);
    phylocanvas.setTextSize(this.state.labelSize);

    phylocanvas.on('updated', this.handleTreeBranchSelected);
    phylocanvas.on('subtree', this.handleRedrawSubtree);
    phylocanvas.on('historytoggle', this.handleHistoryToggle);

    phylocanvas.load(this.props.newick, () => {
      this.props.styleTree(phylocanvas);
      phylocanvas.draw();
    });

    this.phylocanvas = phylocanvas;
  },

  componentDidUpdate() {
    this.phylocanvas.resizeToContainer();
    this.phylocanvas.fitInPanel();
    this.phylocanvas.draw();
  },

  render() {
    const { navButton } = this.props;

    return (
      <section style={fullWidthHeight}>
        <header className="wgsa-tree-header">
          { navButton &&
              <button title={navButton.title} className="wgsa-tree-return mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" onClick={navButton.onClick}>
                <i className="material-icons">{navButton.icon}</i>
              </button>
          }
          <h2 className="wgsa-tree-heading">{this.props.title}</h2>
          <div className="wgsa-tree-menu" ref="menu">
            <button id="tree-options" className="wgsa-tree-actions mdl-button mdl-js-button mdl-button--icon">
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="tree-options">
              <li className="mdl-menu__item" onClick={this.handleToggleNodeLabels}>Toggle Labels</li>
              <li className="mdl-menu__item" onClick={this.handleToggleNodeAlign}>Toggle Label Align</li>
              <li className="mdl-menu__item" onClick={this.handleRedrawOriginalTree}>Redraw Original Tree</li>
              <li className="mdl-menu__item">
                <a href={this.phylocanvas ? this.phylocanvas.getPngUrl() : '#'} download={`${this.props.title}.png`} target="_blank">
                  Export Current View
                </a>
              </li>
            </ul>
          </div>
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

  handleNodeSizeChange(event) {
    this.phylocanvas.setNodeSize(event.target.value);
  },

  handleLabelSizeChange(event) {
    this.phylocanvas.setTextSize(event.target.value);
  },

  handleToggleNodeLabels() {
    this.phylocanvas.toggleLabels();
  },

  handleRedrawOriginalTree() {
    this.phylocanvas.redrawOriginalTree();
    this.props.styleTree(this.phylocanvas);
    this.phylocanvas.draw();
  },

  handleToggleNodeAlign() {
    this.phylocanvas.alignLabels = !this.phylocanvas.alignLabels;
    this.phylocanvas.draw();
  },

});
