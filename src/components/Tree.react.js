import React from 'react';
import PhyloCanvas from 'PhyloCanvas';

import DEFAULT, { CGPS } from '../defaults';

const style = {
  height: '100%',
  width: '100%',
};

export default React.createClass({

  propTypes: {
    newick: true,
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

  componentDidMount: function () {
    const phylocanvas = PhyloCanvas.createTree('phylocanvas-container');
    phylocanvas.load(this.props.newick);

    phylocanvas.showLabels = true;
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

  componentDidUpdate() {
    this.phylocanvas.resizeToContainer();
    this.phylocanvas.fitInPanel();
    this.phylocanvas.draw();
  },

  render: function () {
    return (
      <div id="phylocanvas-container" style={style}></div>
    );
  },

  phylocanvas: null,

});
